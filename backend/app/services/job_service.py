from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.job_repo import JobRepository

class JobService:
    def __init__(self, db: AsyncSession):
        self.repo = JobRepository(db)

    async def get_job_by_id(self, job_id: str):
        """Fetches a job by ID and handles 404 logic."""
        job = await self.repo.get_by_id(job_id)
        
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found or has been removed."
            )
            
        return job