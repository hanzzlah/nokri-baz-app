import httpx
from app.core.config import settings

async def send_whatsapp_alert(phone_number: str, job_title: str, match_score: int, job_url: str):
    """Sends a WhatsApp template message to the user."""
    if not settings.WHATSAPP_API_TOKEN:
        print(f"Mock WhatsApp sent to {phone_number}: {job_title} ({match_score}% Match)")
        return True

    url = f"https://graph.facebook.com/v17.0/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {settings.WHATSAPP_API_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": phone_number,
        "type": "template",
        "template": {
            "name": "new_job_alert",
            "language": {"code": "en_US"},
            "components": [
                {"type": "body", "parameters": [{"type": "text", "text": job_title}, {"type": "text", "text": str(match_score)}]}
            ]
        }
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=payload)
        return response.status_code == 200