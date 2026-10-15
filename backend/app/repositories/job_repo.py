from uuid import UUID
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.job import Job
from app.schemas.job import JobMatchResponse

class JobRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, job_id: str) -> Job | None:
        stmt = select(Job).where(Job.id == job_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def match_jobs_for_user(
        self, 
        user_id: UUID, 
        limit: int = 20
    ) -> list[JobMatchResponse]:
        """Executes the PostgreSQL 2-stage matching RPC function and enriches with job details."""
        
        # We join the RPC output (m) with the actual jobs table (j) to get the missing rich data
        sql = text("""
            SELECT 
                m.job_id AS id, 
                m.title, 
                COALESCE(j.employer, m.employer, 'Unknown Department') AS department,
                m.source AS portal_source, 
                m.match_score AS similarity_score,
                COALESCE(j.employment_type, 'Regular') AS type,
                COALESCE(j.grade_level, 'Not Specified') AS salary_range,
                CAST(j.last_date_to_apply AS VARCHAR) AS deadline,
                j.district,
                j.division,
                CASE 
                    WHEN m.source ILIKE '%Punjab%' THEN 'Punjab' 
                    ELSE 'Federal' 
                END AS province,
                COALESCE(j.education_years, 0) AS education_years_req,
                COALESCE(j.experience_years, 0) AS experience_req
            FROM match_jobs_for_user(:user_id, :limit_val) m
            JOIN jobs j ON m.job_id = j.id
        """)
        
        result = await self.db.execute(
            sql, 
            {"user_id": str(user_id), "limit_val": limit}
        )
        
        rows = result.mappings().all()
        return [JobMatchResponse.model_validate(row) for row in rows]