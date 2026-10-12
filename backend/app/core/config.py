from pydantic_settings import BaseSettings, SettingsConfigDict 


class Settings(BaseSettings):
    PROJECT_NAME: str = "Gov Jobs SaaS API"
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str
    SUPABASE_URL: str

    # Supabase Auth
    SUPABASE_JWT_SECRET: str

    # AI & Embeddings
    COHERE_API_KEY: str

    # WhatsApp Integration
    WHATSAPP_API_TOKEN: str = ""
    WHATSAPP_PHONE_NUMBER_ID: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )
    LEMON_SQUEEZY_API_KEY: str | None = None
    LEMON_SQUEEZY_WEBHOOK_SECRET: str | None = None
    LEMON_SQUEEZY_STORE_ID: str | None = None
    LEMON_SQUEEZY_VARIANT_ID: str | None = None

# Instantiate single global settings instance
settings = Settings()