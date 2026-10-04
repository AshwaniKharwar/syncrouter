from fastapi import APIRouter
from src.apps.router_api.api.v1.chat import router as chat_router

router = APIRouter()
router.include_router(chat_router, prefix="/chat")