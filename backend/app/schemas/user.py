from uuid import UUID
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field


class UserProfileBase(BaseModel):
    full_name: str
    phone_number: str | None = None
    date_of_birth: date
    gender: str | None = Field(None, description="Male, Female, or Other")
    district: str | None = None
    division: str | None = None
    education_years: int = Field(..., ge=0, description="Minimum numeric education years (e.g., 16)")
    degree_title: str | None = None
    experience_years: int = Field(0, ge=0)
    resume_url: str | None = None


class UserProfileCreate(UserProfileBase):
    """Payload sent by user during onboarding/update."""
    pass


class UserProfileResponse(UserProfileBase):
    """Payload returned by API."""
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)