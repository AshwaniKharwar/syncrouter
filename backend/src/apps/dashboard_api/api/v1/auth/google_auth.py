from typing import Annotated
from urllib.parse import quote

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession

from src.apps.dashboard_api.services.auth_service import (
    GoogleAuthError,
    build_google_auth_url,
    exchange_code_for_token,
    fetch_userinfo,
    generate_state,
    get_or_create_user,
)
from src.shared.config import settings
from src.shared.database import get_db
from src.shared.security import create_access_token

router = APIRouter(prefix="/google", tags=["Google Auth"])

STATE_SESSION_KEY = "google_oauth_state"


@router.get("/login")
async def google_login(request: Request) -> RedirectResponse:
    state = generate_state()
    request.session[STATE_SESSION_KEY] = state
    auth_url = build_google_auth_url(state)
    return RedirectResponse(auth_url)


@router.get("/callback")
async def google_callback(
    request: Request,
    code: str | None = Query(None),
    state: str | None = Query(None),
    error: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    if error:
        return _redirect_with_message("error", f"Google sign-in failed: {error}")
    if not code or not state:
        return _redirect_with_message("error", "Missing authorization code or state")
    expected_state = request.session.get(STATE_SESSION_KEY)
    if not expected_state or expected_state != state:
        return _redirect_with_message("error", "Invalid OAuth state")
    request.session.pop(STATE_SESSION_KEY, None)
    try:
        token_data = await exchange_code_for_token(code)
    except GoogleAuthError as exc:
        return _redirect_with_message("error", str(exc))
    try:
        profile = await fetch_userinfo(token_data["access_token"])
    except GoogleAuthError as exc:
        return _redirect_with_message("error", str(exc))
    user = await get_or_create_user(db, profile)
    access_token = create_access_token(user.id)
    response = _redirect_with_message("success", "Authentication successful")
    
    # Set cookie (consider making secure dynamic via settings if testing over HTTP)
    response.set_cookie(
        key=settings.TOKEN_COOKIE_NAME,
        value=access_token,
        httponly=True,
        secure=False,  # Set to False for local HTTP development
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    return response
def _redirect_with_message(result: str, message: str) -> RedirectResponse:
    base = settings.FRONTEND_URL.rstrip("/")
    encoded_message = quote(message)
    return RedirectResponse(f"{base}/auth/{result}?message={encoded_message}")