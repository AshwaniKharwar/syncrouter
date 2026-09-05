import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CompanyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    website: str | None
    created_at: datetime
    updated_at: datetime


class ModelOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    name: str
    slug: str
    company: CompanyOut
    created_at: datetime
    updated_at: datetime


class ProviderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    website: str | None
    created_at: datetime
    updated_at: datetime


class ModelProviderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    mapping_id: uuid.UUID
    name: str
    website: str | None
    input_token_cost: float
    output_token_cost: float
    created_at: datetime
    updated_at: datetime
