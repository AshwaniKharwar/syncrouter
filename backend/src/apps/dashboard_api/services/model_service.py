import uuid
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.apps.dashboard_api.schemas.models import ModelProviderOut
from src.shared.models.ai_model import AIModel
from src.shared.models.ai_provider import AIProvider
from src.shared.models.model_provider_mapping import ModelProviderMapping


async def get_all_models(db: AsyncSession) -> Sequence[AIModel]:
    """Retrieve all AI models with their associated company."""
    query = (
        select(AIModel)
        .options(selectinload(AIModel.company))
        .order_by(AIModel.name)
    )
    result = await db.scalars(query)
    return result.all()


async def get_all_providers(db: AsyncSession) -> Sequence[AIProvider]:
    """Retrieve all AI providers."""
    query = select(AIProvider).order_by(AIProvider.name)
    result = await db.scalars(query)
    return result.all()


async def get_providers_for_model(
    db: AsyncSession, model_id: uuid.UUID
) -> list[ModelProviderOut] | None:
    """Retrieve all providers offering a specific model with their token costs."""
    # Check if model exists
    model_exists = await db.scalar(
        select(AIModel.id).where(AIModel.id == model_id)
    )
    if not model_exists:
        return None

    query = (
        select(ModelProviderMapping)
        .options(selectinload(ModelProviderMapping.provider))
        .where(ModelProviderMapping.model_id == model_id)
        .order_by(ModelProviderMapping.created_at)
    )
    result = await db.scalars(query)
    mappings = result.all()

    return [
        ModelProviderOut(
            id=mapping.provider.id,
            mapping_id=mapping.id,
            name=mapping.provider.name,
            website=mapping.provider.website,
            input_token_cost=float(mapping.input_token_cost),
            output_token_cost=float(mapping.output_token_cost),
            created_at=mapping.provider.created_at,
            updated_at=mapping.provider.updated_at,
        )
        for mapping in mappings
    ]
