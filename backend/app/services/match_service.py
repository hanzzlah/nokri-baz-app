from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.job import JobMatchResponse
from app.repositories.job_repo import JobRepository

class MatchService:
    def __init__(self, db: AsyncSession):
        self.repo = JobRepository(db)

    async def get_user_matches(self, user_id: UUID, limit: int = 20) -> list[JobMatchResponse]:
        """Fetches ranked job matches for a specific user."""
        return await self.repo.match_jobs_for_user(user_id, limit)