from pydantic_settings import BaseSettings, SettingsConfigDict # type: ignore


class Settings(BaseSettings):
    PROJECT_NAME: str = "Gov Jobs SaaS API"
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str

    # Supabase Auth
    SUPABASE_JWT_SECRET: str

    # AI & Embeddings
    VOYAGE_API_KEY: str

    # WhatsApp Integration
    WHATSAPP_API_TOKEN: str = ""
    WHATSAPP_PHONE_NUMBER_ID: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


# Instantiate single global settings instance
settings = Settings()