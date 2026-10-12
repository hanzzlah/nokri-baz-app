import cohere
from app.core.config import settings

# Initialize the async client with the API key from core/config.py
co = cohere.AsyncClient(api_key=settings.COHERE_API_KEY)

async def generate_profile_embedding(text_summary: str) -> list[float] | None:
    """Generates a vector embedding for user profiles using Cohere."""
    try:
        response = await co.embed(
            texts=[text_summary],
            model="embed-english-v3.0",
            input_type="search_document"
        )
        return [float(x) for x in response.embeddings[0]]
    except Exception as e:
        print(f"Embedding generation failed: {e}")
        return None