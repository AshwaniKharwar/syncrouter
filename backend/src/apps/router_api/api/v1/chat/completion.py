import logging
import traceback
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.apps.router_api.dependencies import RouterAuthContext, get_api_key_auth
from src.apps.router_api.schemas.completion import (
    ChatCompletionRequest,
    ChatCompletionResponse,
)
from src.apps.router_api.services import completion as completion_service
from src.shared.database import get_db

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/completions",
    response_model=ChatCompletionResponse,
    status_code=status.HTTP_200_OK,
    summary="Create chat completion",
    description="Creates a model response for the given chat conversation, routing through the optimal AI provider.",
)
@router.post(
    "/completion",
    response_model=ChatCompletionResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
@router.post(
    "/",
    response_model=ChatCompletionResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
async def chat_completion(
    payload: ChatCompletionRequest,
    auth: Annotated[RouterAuthContext, Depends(get_api_key_auth)],
    db: Annotated[AsyncSession, Depends(get_db)],
    response: Response,
):
    """Execute buffered chat completion with cost-based provider routing."""
    try:
        result = await completion_service.create_chat_completion(
            db=db,
            auth=auth,
            request=payload,
        )

        # Set helpful telemetry headers
        if result.usage.routed_provider:
            response.headers["x-syncrouter-provider"] = result.usage.routed_provider
        if result.usage.cost_saved is not None:
            response.headers["x-syncrouter-cost-saved-per-1m"] = f"${result.usage.cost_saved:.6f}"

        return result

    except HTTPException:
        raise
    except Exception as exc:
        print(f"[CHAT COMPLETION ERROR] User {auth.user.id}: {exc}", flush=True)
        traceback.print_exc()
        logger.error("Unexpected error in chat completion: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": {
                    "message": f"Internal routing server error: {str(exc)}",
                    "type": "server_error",
                    "code": "internal_error",
                }
            },
        )

