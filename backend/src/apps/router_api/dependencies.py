from dataclasses import dataclass
from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.shared.database import get_db
from src.shared.models.api_key import ApiKey
from src.shared.models.user import User
from src.shared.models.user_credit import UserCredit


@dataclass
class RouterAuthContext:
    user: User
    api_key: ApiKey
    credit: UserCredit


async def get_api_key_auth(
    request: Request,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> RouterAuthContext:
    """Validate incoming API key from Authorization header or X-API-Key header.
    
    Verifies key validity, active status, user status, and credit balance.
    """
    raw_key: str | None = None

    authorization = request.headers.get("Authorization")
    if authorization:
        if authorization.startswith("Bearer "):
            raw_key = authorization.removeprefix("Bearer ").strip()
        else:
            raw_key = authorization.strip()

    if not raw_key:
        raw_key = request.headers.get("x-api-key") or request.headers.get("api-key")

    if not raw_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "error": {
                    "message": "Missing API key. Please pass your API key via the 'Authorization: Bearer <key>' or 'x-api-key' header.",
                    "type": "invalid_request_error",
                    "code": "missing_api_key",
                }
            },
        )

    # Query the API key
    query = (
        select(ApiKey)
        .options(
            selectinload(ApiKey.user).selectinload(User.credit),
        )
        .where(
            ApiKey.api_key == raw_key,
            ApiKey.deleted.is_(False),
        )
    )
    result = await db.scalars(query)
    api_key_record = result.one_or_none()

    if not api_key_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "error": {
                    "message": "Invalid API key provided.",
                    "type": "invalid_request_error",
                    "code": "invalid_api_key",
                }
            },
        )

    if not api_key_record.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "error": {
                    "message": "API key is deactivated.",
                    "type": "invalid_request_error",
                    "code": "api_key_inactive",
                }
            },
        )

    user = api_key_record.user
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "error": {
                    "message": "User account associated with this API key is inactive or not found.",
                    "type": "invalid_request_error",
                    "code": "user_inactive",
                }
            },
        )

    credit = user.credit
    if credit is not None and credit.credits <= 0:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "error": {
                    "message": "You have insufficient credits remaining. Please top up your balance in the dashboard.",
                    "type": "insufficient_quota",
                    "code": "insufficient_credits",
                }
            },
        )

    return RouterAuthContext(
        user=user,
        api_key=api_key_record,
        credit=credit,
    )
