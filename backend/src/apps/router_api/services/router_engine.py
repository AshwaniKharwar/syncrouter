from dataclasses import dataclass
from typing import Sequence

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.shared.models.ai_model import AIModel
from src.shared.models.model_provider_mapping import ModelProviderMapping


@dataclass
class RouteResolution:
    model: AIModel
    primary_mapping: ModelProviderMapping
    failover_mappings: list[ModelProviderMapping]
    cost_saved_per_1m: float
    all_mappings: Sequence[ModelProviderMapping]


def parse_model_string(model_str: str, explicit_provider: str | None = None) -> tuple[str, str | None]:
    """Parse a model identifier that may contain a provider prefix.
    
    Examples:
      'openai/gpt-5.5' -> ('gpt-5.5', 'openai')
      'azure/gpt-5.5'  -> ('gpt-5.5', 'azure')
      'gpt-5.5'        -> ('gpt-5.5', explicit_provider)
    """
    cleaned = model_str.strip()
    if "/" in cleaned:
        prefix, _, slug = cleaned.partition("/")
        return slug.strip(), prefix.strip()
    return cleaned, explicit_provider


async def resolve_route(
    db: AsyncSession,
    model_query: str,
    explicit_provider: str | None = None,
    routing_strategy: str = "cheapest",
) -> RouteResolution:
    """Resolve the requested model and choose the optimal provider from the database."""
    slug, provider_name = parse_model_string(model_query, explicit_provider)

    # 1. Query model from ai_models
    model_stmt = (
        select(AIModel)
        .where(
            (func.lower(AIModel.slug) == slug.lower())
            | (func.lower(AIModel.name) == slug.lower())
        )
    )
    result = await db.scalars(model_stmt)
    model = result.one_or_none()

    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": {
                    "message": f"Model '{slug}' not found in SyncRouter model catalog.",
                    "type": "invalid_request_error",
                    "code": "model_not_found",
                    "param": "model",
                }
            },
        )

    # 2. Query all provider mappings for this model
    mappings_stmt = (
        select(ModelProviderMapping)
        .options(selectinload(ModelProviderMapping.provider))
        .where(ModelProviderMapping.model_id == model.id)
    )
    mappings_res = await db.scalars(mappings_stmt)
    mappings = list(mappings_res.all())

    if not mappings:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": {
                    "message": f"No providers are currently registered for model '{model.name}' ({model.slug}).",
                    "type": "invalid_request_error",
                    "code": "no_provider_available",
                    "param": "model",
                }
            },
        )

    # 3. Route according to requested provider or cheapest algorithm
    if provider_name:
        matching = [
            m for m in mappings
            if m.provider.name.lower() == provider_name.lower()
        ]
        if not matching:
            available = [m.provider.name for m in mappings]
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "error": {
                        "message": f"Provider '{provider_name}' does not offer model '{model.name}'. Available providers: {available}",
                        "type": "invalid_request_error",
                        "code": "provider_not_found_for_model",
                        "param": "provider",
                    }
                },
            )
        primary = matching[0]
        failovers = [m for m in mappings if m.id != primary.id]
        cost_saved = 0.0
    else:
        # Sort by total token cost (input + output) ascending
        sorted_mappings = sorted(
            mappings,
            key=lambda m: float(m.input_token_cost) + float(m.output_token_cost),
        )
        primary = sorted_mappings[0]
        failovers = sorted_mappings[1:]

        max_combined = max(
            float(m.input_token_cost) + float(m.output_token_cost) for m in mappings
        )
        chosen_combined = float(primary.input_token_cost) + float(primary.output_token_cost)
        cost_saved = round(max(0.0, max_combined - chosen_combined), 6)

    return RouteResolution(
        model=model,
        primary_mapping=primary,
        failover_mappings=failovers,
        cost_saved_per_1m=cost_saved,
        all_mappings=mappings,
    )
