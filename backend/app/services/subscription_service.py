import hmac
import hashlib
import json
import httpx
from uuid import UUID
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.repositories.subscription_repo import SubscriptionRepository

class SubscriptionService:
    def __init__(self, db: AsyncSession):
        self.repo = SubscriptionRepository(db)

    async def generate_checkout_url(self, user_id: UUID) -> str:
        """Calls Lemon Squeezy API to generate a checkout link."""
        url = "https://api.lemonsqueezy.com/v1/checkouts"
        headers = {
            "Accept": "application/vnd.api+json",
            "Content-Type": "application/vnd.api+json",
            "Authorization": f"Bearer {settings.LEMON_SQUEEZY_API_KEY}"
        }
        
        payload = {
            "data": {
                "type": "checkouts",
                "attributes": {
                    "checkout_data": {
                        "custom": {"user_id": str(user_id)}
                    }
                },
                "relationships": {
                    "store": {"data": {"type": "stores", "id": settings.LEMON_SQUEEZY_STORE_ID}},
                    "variant": {"data": {"type": "variants", "id": settings.LEMON_SQUEEZY_VARIANT_ID}}
                }
            }
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=payload)
            if response.status_code != 201:
                raise HTTPException(status_code=400, detail="Checkout creation failed")
            
            return response.json()["data"]["attributes"]["url"]

    async def process_webhook(self, payload: bytes, signature: str) -> None:
        """Validates HMAC signature and delegates db updates based on event type."""
        if not signature:
            raise HTTPException(status_code=401, detail="Missing signature")

        # 1. Verify Signature
        secret = settings.LEMON_SQUEEZY_WEBHOOK_SECRET.encode('utf-8')
        expected = hmac.new(secret, payload, hashlib.sha256).hexdigest()
        
        if not hmac.compare_digest(expected, signature):
            raise HTTPException(status_code=401, detail="Invalid signature")

        # 2. Extract Data
        data = json.loads(payload)
        event_name = data["meta"]["event_name"]
        
        # Safely extract user_id from custom data
        custom_data = data["meta"].get("custom_data", {})
        user_id = custom_data.get("user_id")
        
        if not user_id:
            return  # Ignore events not tied to our system

        # 3. Delegate to Repository
        if event_name == "subscription_created":
            attributes = data["data"]["attributes"]
            await self.repo.activate_pro(
                user_id=user_id,
                customer_id=str(attributes.get("customer_id")),
                subscription_id=str(data["data"]["id"])
            )
        elif event_name in ["subscription_cancelled", "subscription_expired"]:
            await self.repo.cancel_pro(user_id=user_id)