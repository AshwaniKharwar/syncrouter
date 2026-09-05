import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ApiKeyCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Name or description of the API key")


class ApiKeyUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255, description="Updated name")
    is_active: bool | None = Field(default=None, description="Enable or disable the API key")


class ApiKeyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    api_key: str
    is_active: bool
    created_at: datetime
    updated_at: datetime


class ApiKeyCreateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    api_key: str
    is_active: bool
    created_at: datetime
    updated_at: datetime


class ApiKeyMessage(BaseModel):
    message: str
