from typing import Annotated

from fastapi import APIRouter, Depends, Response, status

from src.apps.dashboard_api.schemas.auth import AuthMessage, UserOut
from src.shared.config import settings
from src.shared.models.user import User
from src.shared.security import get_current_user

router = APIRouter( tags=["Auth"])


@router.get("/me", response_model=UserOut)
async def get_me(user: Annotated[User, Depends(get_current_user)]) -> User:
    return user


@router.post("/logout", response_model=AuthMessage, status_code=status.HTTP_200_OK)
async def logout(response: Response) -> AuthMessage:
    response.delete_cookie(key=settings.TOKEN_COOKIE_NAME, path="/")
    return AuthMessage(message="Logged out successfully")
