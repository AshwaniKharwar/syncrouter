import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, UniqueConstraint, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.shared.database import Base


class ModelProviderMapping(Base):
    __tablename__ = "model_provider_mappings"
    __table_args__ = (
        UniqueConstraint("model_id", "provider_id", name="uq_model_provider"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    model_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("ai_models.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    provider_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("ai_providers.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    input_token_cost: Mapped[float] = mapped_column(
        Numeric(12, 6, asdecimal=False), nullable=False, default=0.0
    )
    output_token_cost: Mapped[float] = mapped_column(
        Numeric(12, 6, asdecimal=False), nullable=False, default=0.0
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    model: Mapped["AIModel"] = relationship(back_populates="provider_mappings")
    provider: Mapped["AIProvider"] = relationship(back_populates="model_mappings")