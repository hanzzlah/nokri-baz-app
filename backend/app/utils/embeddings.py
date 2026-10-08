from voyageai.client_async import AsyncClient
from app.core.config import settings

# Initialize the async client with the API key from core/config.py
vo = AsyncClient(api_key=settings.VOYAGE_API_KEY)

async def generate_profile_embedding(text_summary: str) -> list[float] | None:
    """Generates a 1536-dimensional vector embedding for user profiles."""
    try:
        result = await vo.embed(
            texts=[text_summary],
            model="voyage-4",
            output_dimension=1536,
            input_type="document"
        )
        return [float(x) for x in result.embeddings[0]]
    except Exception as e:
        print(f"Embedding generation failed: {e}")
        return None