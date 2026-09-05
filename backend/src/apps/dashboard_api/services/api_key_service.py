import secrets
import uuid
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.apps.dashboard_api.schemas.api_key import ApiKeyOut
from src.shared.models.api_key import ApiKey


def generate_api_key() -> str:
    """Generate a secure API key with prefix."""
    return f"sync_{secrets.token_urlsafe(32)}"


def mask_api_key(key: str) -> str:
    """Mask the API key, showing only the first 3 and last 3 characters."""
    if len(key) <= 6:
        return key
    return f"{key[:3]}...{key[-3:]}"


async def create_api_key(
    db: AsyncSession,
    user_id: uuid.UUID,
    name: str,
) -> ApiKey:
    """Create a new API key for the given user."""
    raw_key = generate_api_key()
    api_key_record = ApiKey(
        user_id=user_id,
        name=name,
        api_key=raw_key,
        is_active=True,
        deleted=False,
    )
    db.add(api_key_record)
    await db.commit()
    await db.refresh(api_key_record)
    return api_key_record


async def get_user_api_keys(
    db: AsyncSession,
    user_id: uuid.UUID,
) -> list[ApiKeyOut]:
    """Retrieve all non-deleted API keys for a user with masked secret keys."""
    query = (
        select(ApiKey)
        .where(ApiKey.user_id == user_id, ApiKey.deleted.is_(False))
        .order_by(ApiKey.created_at.desc())
    )
    result = await db.scalars(query)
    keys = result.all()

    return [
        ApiKeyOut(
            id=k.id,
            name=k.name,
            api_key=mask_api_key(k.api_key),
            is_active=k.is_active,
            created_at=k.created_at,
            updated_at=k.updated_at,
        )
        for k in keys
    ]


async def get_api_key_by_id(
    db: AsyncSession,
    user_id: uuid.UUID,
    api_key_id: uuid.UUID,
) -> ApiKey | None:
    """Retrieve a specific non-deleted API key belonging to a user."""
    query = select(ApiKey).where(
        ApiKey.id == api_key_id,
        ApiKey.user_id == user_id,
        ApiKey.deleted.is_(False),
    )
    return await db.scalar(query)


async def update_api_key(
    db: AsyncSession,
    user_id: uuid.UUID,
    api_key_id: uuid.UUID,
    name: str | None = None,
    is_active: bool | None = None,
) -> ApiKeyOut | None:
    """Update an API key's name and/or enabled (active) status."""
    key = await get_api_key_by_id(db, user_id, api_key_id)
    if not key:
        return None

    if name is not None:
        key.name = name
    if is_active is not None:
        key.is_active = is_active

    await db.commit()
    await db.refresh(key)

    return ApiKeyOut(
        id=key.id,
        name=key.name,
        api_key=mask_api_key(key.api_key),
        is_active=key.is_active,
        created_at=key.created_at,
        updated_at=key.updated_at,
    )


async def delete_api_key(
    db: AsyncSession,
    user_id: uuid.UUID,
    api_key_id: uuid.UUID,
) -> bool:
    """Soft delete an API key by marking it as deleted."""
    key = await get_api_key_by_id(db, user_id, api_key_id)
    if not key:
        return False

    key.deleted = True
    key.is_active = False
    await db.commit()
    return True
