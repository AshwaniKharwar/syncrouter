from collections.abc import AsyncGenerator
import logging
import time
import uuid

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.apps.router_api.dependencies import RouterAuthContext
from src.apps.router_api.schemas.completion import (
    ChatCompletionChoice,
    ChatCompletionChunk,
    ChatCompletionChunkChoice,
    ChatCompletionChunkDelta,
    ChatCompletionRequest,
    ChatCompletionResponse,
    ChatCompletionResponseMessage,
    ChatCompletionUsage,
)
from src.apps.router_api.services.adapters.factory import get_adapter_for_provider
from src.apps.router_api.services.router_engine import resolve_route
from src.apps.router_api.services.token_service import (
    calculate_cost,
    deduct_user_credits,
    estimate_message_tokens,
    estimate_string_tokens,
)

logger = logging.getLogger(__name__)


async def create_chat_completion(
    db: AsyncSession,
    auth: RouterAuthContext,
    request: ChatCompletionRequest,
) -> ChatCompletionResponse:
    """Execute non-streaming chat completion with dynamic cost-based routing and credit deduction."""
    resolution = await resolve_route(
        db=db,
        model_query=request.model,
        explicit_provider=request.provider,
        routing_strategy=request.routing_strategy,
    )

    candidate_mappings = [resolution.primary_mapping] + resolution.failover_mappings
    last_exception: Exception | None = None
    executed_mapping = None
    result = None

    for mapping in candidate_mappings:
        try:
            adapter = get_adapter_for_provider(mapping.provider.name)
            result = await adapter.complete(request, resolution.model.slug)
            executed_mapping = mapping
            break
        except HTTPException as exc:
            last_exception = exc
            # If provider is not configured or unsupported, do not failover silently if user explicitly asked for it
            if request.provider and exc.status_code == 501:
                raise
            # If 501 (not configured yet) or 502/503/504 (upstream error), try failover if available
            if exc.status_code in (501, 502, 503, 504) and len(candidate_mappings) > 1:
                logger.warning(
                    "Provider %s failed with code %d, attempting failover...",
                    mapping.provider.name,
                    exc.status_code,
                )
                continue
            raise
        except Exception as exc:
            last_exception = exc
            logger.error("Unexpected error executing completion with %s: %s", mapping.provider.name, exc)
            if len(candidate_mappings) > 1:
                continue
            raise

    if not result or not executed_mapping:
        if last_exception:
            raise last_exception
        raise HTTPException(
            status_code=500,
            detail={"error": {"message": "Failed to complete chat completion through any provider.", "type": "server_error"}},
        )

    # Calculate token usage and costs
    prompt_tokens = result.prompt_tokens or estimate_message_tokens(request.messages)
    completion_tokens = result.completion_tokens or estimate_string_tokens(result.content)
    total_tokens = result.total_tokens or (prompt_tokens + completion_tokens)

    input_cost, output_cost, total_cost = calculate_cost(
        prompt_tokens=prompt_tokens,
        completion_tokens=completion_tokens,
        mapping=executed_mapping,
    )

    # Deduct user credits atomically
    await deduct_user_credits(db=db, credit=auth.credit, credits_to_deduct=1)

    completion_id = f"chatcmpl-{uuid.uuid4().hex[:24]}"
    created_ts = int(time.time())

    return ChatCompletionResponse(
        id=completion_id,
        object="chat.completion",
        created=created_ts,
        model=resolution.model.slug,
        choices=[
            ChatCompletionChoice(
                index=0,
                message=ChatCompletionResponseMessage(
                    role=result.role,
                    content=result.content,
                ),
                finish_reason=result.finish_reason or "stop",
            )
        ],
        usage=ChatCompletionUsage(
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=total_tokens,
            input_cost=input_cost,
            output_cost=output_cost,
            total_cost=total_cost,
            routed_provider=executed_mapping.provider.name,
            cost_saved=resolution.cost_saved_per_1m,
        ),
    )


async def stream_chat_completion(
    db: AsyncSession,
    auth: RouterAuthContext,
    request: ChatCompletionRequest,
) -> AsyncGenerator[str, None]:
    """Execute streaming chat completion with dynamic routing and SSE event formatting."""
    resolution = await resolve_route(
        db=db,
        model_query=request.model,
        explicit_provider=request.provider,
        routing_strategy=request.routing_strategy,
    )

    mapping = resolution.primary_mapping
    adapter = get_adapter_for_provider(mapping.provider.name)

    # Deduct 1 credit upfront for streaming request
    await deduct_user_credits(db=db, credit=auth.credit, credits_to_deduct=1)

    completion_id = f"chatcmpl-{uuid.uuid4().hex[:24]}"
    created_ts = int(time.time())

    # Send initial chunk with assistant role
    initial_chunk = ChatCompletionChunk(
        id=completion_id,
        created=created_ts,
        model=resolution.model.slug,
        choices=[
            ChatCompletionChunkChoice(
                index=0,
                delta=ChatCompletionChunkDelta(role="assistant", content=""),
                finish_reason=None,
            )
        ],
    )
    yield f"data: {initial_chunk.model_dump_json()}\n\n"

    # Stream deltas from provider adapter
    async for chunk in adapter.complete_stream(request, resolution.model.slug):
        if chunk.content or chunk.finish_reason:
            stream_chunk = ChatCompletionChunk(
                id=completion_id,
                created=created_ts,
                model=resolution.model.slug,
                choices=[
                    ChatCompletionChunkChoice(
                        index=0,
                        delta=ChatCompletionChunkDelta(content=chunk.content),
                        finish_reason=chunk.finish_reason,
                    )
                ],
            )
            yield f"data: {stream_chunk.model_dump_json()}\n\n"

    # Send final [DONE] indicator
    yield "data: [DONE]\n\n"
