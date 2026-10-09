from fastapi import APIRouter
from app.api.v1.endpoints import profile, jobs, webhooks

api_router = APIRouter()

api_router.include_router(profile.router, prefix="/profile", tags=["Profile"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["Jobs"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["Webhooks"])