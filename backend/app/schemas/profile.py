from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional
from uuid import UUID
from datetime import date

class ProfileBase(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[date | str] = None
    gender: Optional[str] = "Male"
    domicile: Optional[str] = "Punjab"
    division: Optional[str] = None
    district: Optional[str] = None
    degree_title: str
    education_years: int
    experience_years: int

    @field_validator("date_of_birth", mode="before")
    @classmethod
    def parse_date(cls, v):
        if isinstance(v, str) and v.strip():
            return date.fromisoformat(v)
        return v if isinstance(v, date) else None

class ProfileCreate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    user_id: UUID
    resume_text: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)