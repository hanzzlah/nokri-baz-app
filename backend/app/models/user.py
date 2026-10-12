import uuid
from datetime import date, datetime
from sqlalchemy import String, Integer, Date, DateTime, text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector

from app.core.database import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    phone_number: Mapped[str | None] = mapped_column(String, unique=True)
    
    date_of_birth: Mapped[date] = mapped_column(Date, nullable=False)
    gender: Mapped[str | None] = mapped_column(String)
    district: Mapped[str | None] = mapped_column(String)
    division: Mapped[str | None] = mapped_column(String)
    
    education_years: Mapped[int] = mapped_column(Integer, nullable=False)
    degree_title: Mapped[str | None] = mapped_column(String)
    experience_years: Mapped[int] = mapped_column(Integer, default=0)
    
    profile_embedding: Mapped[list[float] | None] = mapped_column(Vector(1024))
    resume_url: Mapped[str | None] = mapped_column(String)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )