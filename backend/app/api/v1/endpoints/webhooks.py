from fastapi import APIRouter, BackgroundTasks, Header, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from pydantic import BaseModel

from app.core.database import get_db
from app.core.config import settings
from app.utils.whatsapp import send_whatsapp_alert

router = APIRouter()

class SupabaseWebhookPayload(BaseModel):
    type: str # "INSERT", "UPDATE"
    table: str
    record: dict # The newly inserted row

async def process_job_notifications(job_id: str, job_title: str, db: AsyncSession):
    """Background task to find users and send alerts."""
    sql = text("SELECT * FROM find_users_for_job(:job_id)")
    result = await db.execute(sql, {"job_id": job_id})
    users = result.mappings().all()

    for user in users:
        # Send Alert
        success = await send_whatsapp_alert(
            phone_number=user["phone_number"],
            job_title=job_title,
            match_score=user["match_score"],
            job_url=f"https://your-saas.com/jobs/{job_id}"
        )
        
        # Log it to prevent duplicate spam (pseudocode)
        if success:
            log_sql = text("""
                INSERT INTO public.notification_logs (user_id, job_id, channel, status)
                VALUES (:uid, :jid, 'WhatsApp', 'Sent')
                ON CONFLICT DO NOTHING
            """)
            await db.execute(log_sql, {"uid": user["user_id"], "jid": job_id})
    
    await db.commit()

@router.post("/supabase-new-job")
async def handle_new_job(
    payload: SupabaseWebhookPayload,
    background_tasks: BackgroundTasks,
    x_webhook_secret: str = Header(...),
    db: AsyncSession = Depends(get_db)
):
    """Webhook listener for Supabase Database Triggers."""
    # Verify the request actually came from your Supabase project
    if x_webhook_secret != settings.SUPABASE_JWT_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized Webhook")

    if payload.type == "INSERT" and payload.table == "jobs":
        job_id = payload.record.get("id")
        job_title = payload.record.get("title")

        if not isinstance(job_id, str) or not isinstance(job_title, str):
            raise HTTPException(
                status_code=400,
                detail="Invalid payload: 'id' and 'title' must be non-null strings.",
            )
        
        # Dispatch to background task immediately
        background_tasks.add_task(process_job_notifications, job_id, job_title, db)

    return {"status": "Processing initiated"}