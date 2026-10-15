from datetime import date, datetime
from sqlalchemy import String, Integer, Boolean, Date, DateTime
from sqlalchemy.orm import Mapped, mapped_column, deferred
from sqlalchemy.dialects.postgresql import ARRAY
from pgvector.sqlalchemy import Vector

from app.core.database import Base

class Job(Base):
    __tablename__ = "jobs" # Maps to the view in public schema

    id: Mapped[str] = mapped_column(String, primary_key=True)
    source: Mapped[str] = mapped_column(String, nullable=False)
    
    title: Mapped[str] = mapped_column(String, nullable=False)
    employer: Mapped[str | None] = mapped_column(String)
    description: Mapped[str | None] = mapped_column(String)
    
    employment_type: Mapped[str | None] = mapped_column(String)
    grade_level: Mapped[str | None] = mapped_column(String)
    vacancies: Mapped[int | None] = mapped_column(Integer)
    
    degree_area: Mapped[str | None] = mapped_column(String)
    education_years: Mapped[int | None] = mapped_column(Integer)
    experience_years: Mapped[int | None] = mapped_column(Integer)
    
    age_min: Mapped[int | None] = mapped_column(Integer)
    age_max: Mapped[int | None] = mapped_column(Integer)
    gender: Mapped[str | None] = mapped_column(String)
    
    monthly_salary_min: Mapped[int | None] = mapped_column(Integer)
    monthly_salary_max: Mapped[int | None] = mapped_column(Integer)
    district: Mapped[str | None] = mapped_column(String)
    division: Mapped[str | None] = mapped_column(String)
    
    date_posted: Mapped[date | None] = mapped_column(Date)
    last_date_to_apply: Mapped[date | None] = mapped_column(Date)
    is_active: Mapped[bool] = mapped_column(Boolean)
    
    search_text: Mapped[str | None] = mapped_column(String)
    embedding: Mapped[list[float] | None] = deferred(mapped_column(Vector(1024)))
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))