from fastapi import APIRouter
from src.apps.dashboard_api.api.v1.auth import router as auth_router
from src.apps.dashboard_api.api.v1.models import router as models_router

router = APIRouter(prefix="/api/v1")
router.include_router(auth_router, tags=["Auth"])
router.include_router(models_router, tags=["Models"])
