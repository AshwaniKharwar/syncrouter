import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    name: str | None
    picture: str | None
    is_active: bool
    credits: int | None = None
    created_at: datetime
    updated_at: datetime


class AuthMessage(BaseModel):
    message: str