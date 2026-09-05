import secrets
from typing import Any

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from urllib.parse import urlencode

from src.shared.config import settings
from src.shared.models.user import User
from src.shared.models.user_credit import UserCredit


class GoogleAuthError(Exception):
    pass


def build_google_auth_url(state: str) -> str:
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URL,
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "online",
        "prompt": "select_account",
    }
    return f"{settings.GOOGLE_AUTH_URL}?{urlencode(params)}"


async def exchange_code_for_token(code: str) -> dict[str, Any]:
    data = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": settings.GOOGLE_REDIRECT_URL,
        "grant_type": "authorization_code",
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(settings.GOOGLE_TOKEN_URL, data=data)
    if response.status_code != 200:
        raise GoogleAuthError("Failed to exchange authorization code")
    return response.json()


async def fetch_userinfo(access_token: str) -> dict[str, Any]:
    headers = {"Authorization": f"Bearer {access_token}"}
    async with httpx.AsyncClient() as client:
        response = await client.get(settings.GOOGLE_USERINFO_URL, headers=headers)
    if response.status_code != 200:
        raise GoogleAuthError("Failed to fetch user info")
    return response.json()


async def get_or_create_user(db: AsyncSession, profile: dict[str, Any]) -> User:
    email = profile["email"]

    result = await db.scalar(select(User).where(User.email == email))
    if result:
        return result

    user = User(
        email=email,
        name=profile.get("name"),
        picture=profile.get("picture"),
    )
    db.add(user)
    await db.flush()

    db.add(UserCredit(user_id=user.id, credits=0))

    await db.commit()
    await db.refresh(user)
    return user


def generate_state() -> str:
    return secrets.token_urlsafe(32)
