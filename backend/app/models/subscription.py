import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base

class Subscription(Base):
    __tablename__ = "subscriptions"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    customer_id: Mapped[str | None] = mapped_column(String, unique=True)
    subscription_id: Mapped[str | None] = mapped_column(String, unique=True)
    
    plan_tier: Mapped[str] = mapped_column(String, server_default="free")
    status: Mapped[str] = mapped_column(String, server_default="inactive")
    
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()"), onupdate=text("now()")
    )