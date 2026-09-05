import logging
import traceback
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.apps.dashboard_api.schemas.api_key import (
    ApiKeyCreate,
    ApiKeyCreateResponse,
    ApiKeyMessage,
    ApiKeyOut,
    ApiKeyUpdate,
)
from src.apps.dashboard_api.services import api_key_service
from src.shared.database import get_db
from src.shared.models.user import User
from src.shared.security import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api-keys")


@router.post("", response_model=ApiKeyCreateResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=ApiKeyCreateResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
async def create_api_key(
    payload: ApiKeyCreate,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ApiKeyCreateResponse:
    """Create a new API key for the authenticated user. The raw secret is returned only once."""
    try:
        api_key_record = await api_key_service.create_api_key(
            db=db,
            user_id=user.id,
            name=payload.name,
        )
        return ApiKeyCreateResponse.model_validate(api_key_record)
    except HTTPException:
        raise
    except Exception as exc:
        print(f"[API ERROR - POST /api-keys] Failed to create API key for user {user.id}: {exc}", flush=True)
        traceback.print_exc()
        logger.error("Error creating API key for user %s: %s", user.id, exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create API key: {str(exc)}",
        )


@router.get("", response_model=list[ApiKeyOut])
@router.get("/", response_model=list[ApiKeyOut], include_in_schema=False)
async def get_api_keys(
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[ApiKeyOut]:
    """Get all non-deleted API keys for the authenticated user (masked)."""
    try:
        return await api_key_service.get_user_api_keys(db=db, user_id=user.id)
    except HTTPException:
        raise
    except Exception as exc:
        print(f"[API ERROR - GET /api-keys] Failed to fetch API keys for user {user.id}: {exc}", flush=True)
        traceback.print_exc()
        logger.error("Error fetching API keys for user %s: %s", user.id, exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve API keys: {str(exc)}",
        )


@router.patch("/{api_key_id}", response_model=ApiKeyOut)
async def update_api_key(
    api_key_id: uuid.UUID,
    payload: ApiKeyUpdate,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ApiKeyOut:
    """Update API key details such as name and enable/disable status."""
    try:
        updated = await api_key_service.update_api_key(
            db=db,
            user_id=user.id,
            api_key_id=api_key_id,
            name=payload.name,
            is_active=payload.is_active,
        )
        if not updated:
            print(f"[API WARNING - PATCH /api-keys/{api_key_id}] API key not found for user {user.id}", flush=True)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="API key not found",
            )
        return updated
    except HTTPException:
        raise
    except Exception as exc:
        print(f"[API ERROR - PATCH /api-keys/{api_key_id}] Failed to update API key for user {user.id}: {exc}", flush=True)
        traceback.print_exc()
        logger.error("Error updating API key %s for user %s: %s", api_key_id, user.id, exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update API key: {str(exc)}",
        )


@router.delete("/{api_key_id}", response_model=ApiKeyMessage)
async def delete_api_key(
    api_key_id: uuid.UUID,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ApiKeyMessage:
    """Soft delete an API key."""
    try:
        deleted = await api_key_service.delete_api_key(
            db=db,
            user_id=user.id,
            api_key_id=api_key_id,
        )
        if not deleted:
            print(f"[API WARNING - DELETE /api-keys/{api_key_id}] API key not found for user {user.id}", flush=True)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="API key not found",
            )
        return ApiKeyMessage(message="API key deleted successfully")
    except HTTPException:
        raise
    except Exception as exc:
        print(f"[API ERROR - DELETE /api-keys/{api_key_id}] Failed to delete API key for user {user.id}: {exc}", flush=True)
        traceback.print_exc()
        logger.error("Error deleting API key %s for user %s: %s", api_key_id, user.id, exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete API key: {str(exc)}",
        )
