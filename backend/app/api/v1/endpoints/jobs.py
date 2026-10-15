from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.dependencies import get_current_user_id
from app.schemas.job import JobMatchResponse, JobResponse
from app.services.match_service import MatchService
from app.services.job_service import JobService

router = APIRouter()

@router.get("/matches", response_model=list[JobMatchResponse])
async def get_job_matches(
    limit: int = 20,
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Returns government jobs strictly matching the user's vector and eligibility."""
    match_service = MatchService(db)
    return await match_service.get_user_matches(user_id, limit)

@router.get("/{job_id}", response_model=JobResponse)
async def get_single_job(
    job_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Fetch complete details for a specific job posting."""
    job_service = JobService(db)
    return await job_service.get_job_by_id(job_id)