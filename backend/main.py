from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from src.apps.dashboard_api.api.v1 import router as dashboard_api_router
from src.apps.router_api.api.v1 import router as router_api_router
from src.shared.config import settings

app = FastAPI()
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

app.include_router(dashboard_api_router, prefix="/dashboard")
app.include_router(router_api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"Hello": "World"}


