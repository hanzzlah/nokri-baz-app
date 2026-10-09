from uuid import UUID
from fastapi import APIRouter, Depends, Request, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.dependencies import get_current_user_id
from app.services.subscription_service import SubscriptionService

router = APIRouter()

@router.post("/checkout")
async def create_checkout_session(
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Endpoint to trigger Lemon Squeezy Checkout."""
    service = SubscriptionService(db)
    checkout_url = await service.generate_checkout_url(user_id)
    return {"checkout_url": checkout_url}

@router.post("/webhook")
async def lemonsqueezy_webhook(
    request: Request,
    x_signature: str = Header(None),
    db: AsyncSession = Depends(get_db)
):
    """Endpoint to listen to Lemon Squeezy status changes."""
    payload = await request.body()
    service = SubscriptionService(db)
    
    await service.process_webhook(payload, x_signature)
    
    return {"status": "success"}