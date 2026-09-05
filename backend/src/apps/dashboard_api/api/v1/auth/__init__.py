from fastapi import APIRouter

from src.apps.dashboard_api.api.v1.auth import google_auth,auth

router = APIRouter(prefix="/auth")
router.include_router(google_auth.router, tags=["Google Auth"])
router.include_router(auth.router, tags=["Auth"])