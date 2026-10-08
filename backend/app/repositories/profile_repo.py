from uuid import UUID
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.job import Job
from app.schemas.job import JobMatchResponse


class JobRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, job_id: str) -> Job | None:
        """Fetch a single job record from public.jobs view."""
        stmt = select(Job).where(Job.id == job_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def match_jobs_for_user(
        self, 
        user_id: UUID, 
        limit: int = 20
    ) -> list[JobMatchResponse]:
        """Executes the PostgreSQL 2-stage matching RPC function."""
        sql = text("""
            SELECT job_id, title, employer, source, match_score
            FROM match_jobs_for_user(:user_id, :limit_val)
        """)
        
        result = await self.db.execute(
            sql, 
            {"user_id": str(user_id), "limit_val": limit}
        )
        
        rows = result.mappings().all()
        return [JobMatchResponse.model_validate(row) for row in rows]