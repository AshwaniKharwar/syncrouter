from fastapi import APIRouter

router = APIRouter(prefix="/models")

@router.get("/")
def get_models():
    return {"message": "Models"}