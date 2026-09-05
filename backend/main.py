from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from src.apps.dashboard_api.api.v1 import router as dashboard_api_router
from src.shared.config import settings

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

app.include_router(dashboard_api_router, prefix="/dashboard")

@app.get("/")
def read_root():
    return {"Hello": "World"}


