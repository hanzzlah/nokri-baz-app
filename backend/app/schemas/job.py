from datetime import date
from pydantic import BaseModel, ConfigDict, Field


class JobResponse(BaseModel):
    id: str
    source: str
    title: str
    employer: str | None = None
    description: str | None = None
    employment_type: str | None = None
    grade_level: str | None = None
    vacancies: int | None = 1
    degree_area: list[str] | None = None
    education_years: int | None = None
    experience_years: int | None = None
    age_min: int | None = None
    age_max: int | None = None
    gender: str | None = None
    monthly_salary_min: int | None = None
    monthly_salary_max: int | None = None
    district: str | None = None
    division: str | None = None
    date_posted: date | None = None
    last_date_to_apply: date | None = None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class JobMatchResponse(BaseModel):
    """Returned by the match_jobs_for_user RPC function."""
    job_id: str
    title: str
    employer: str | None = None
    source: str
    match_score: int = Field(..., ge=0, le=100, description="Matching percentage (0 to 100)")

    model_config = ConfigDict(from_attributes=True)