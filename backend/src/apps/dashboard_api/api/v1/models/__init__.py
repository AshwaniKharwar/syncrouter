import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.apps.dashboard_api.schemas.models import (
    ModelOut,
    ModelProviderOut,
    ProviderOut,
)
from src.apps.dashboard_api.services import model_service
from src.shared.database import get_db

router = APIRouter(prefix="/models")


@router.get("", response_model=list[ModelOut])
@router.get("/", response_model=list[ModelOut], include_in_schema=False)
async def get_models(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[ModelOut]:
    """Get all AI models with their associated company details."""
    models = await model_service.get_all_models(db)
    return list(models)


@router.get("/providers", response_model=list[ProviderOut])
async def get_providers(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[ProviderOut]:
    """Get all AI providers."""
    providers = await model_service.get_all_providers(db)
    return list(providers)


@router.get("/{model_id}/providers", response_model=list[ModelProviderOut])
async def get_model_providers(
    model_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[ModelProviderOut]:
    """Get all providers offering a specific model with their token costs."""
    providers = await model_service.get_providers_for_model(db, model_id)
    if providers is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Model with id '{model_id}' not found",
        )
    return providers