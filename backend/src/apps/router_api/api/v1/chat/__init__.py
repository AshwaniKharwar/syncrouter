from fastapi import APIRouter
from src.apps.router_api.api.v1.chat.completion import router as completion_router

router = APIRouter()
router.include_router(completion_router)

__all__ = ["router"]