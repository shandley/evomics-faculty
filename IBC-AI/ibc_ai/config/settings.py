"""Application settings and configuration."""

from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings configuration.

    Attributes:
        environment: Current environment (development, staging, production)
        log_level: Logging level
        api_secret_key: Secret key for API authentication and encryption
        allowed_origins: Comma-separated list of allowed CORS origins
        openai_api_key: OpenAI API key
        anthropic_api_key: Anthropic API key
        postgres_host: PostgreSQL host
        postgres_port: PostgreSQL port
        postgres_user: PostgreSQL user
        postgres_password: PostgreSQL password
        postgres_db: PostgreSQL database name
        neo4j_uri: Neo4j URI
        neo4j_user: Neo4j user
        neo4j_password: Neo4j password
        weaviate_url: Weaviate URL
    """

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # Application settings
    environment: str = "development"
    log_level: str = "INFO"
    api_secret_key: str = "development_secret_key"
    allowed_origins: str = "http://localhost:3000,http://localhost:8000"

    # AI API keys
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None

    # Database settings
    postgres_host: str = "postgres"
    postgres_port: int = 5432
    postgres_user: str = "postgres"
    postgres_password: str = "postgres"
    postgres_db: str = "ibc_ai"

    # Neo4j settings
    neo4j_uri: str = "bolt://neo4j:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = "password"

    # Vector DB settings
    weaviate_url: str = "http://weaviate:8080"

    @property
    def postgres_dsn(self) -> str:
        """Get PostgreSQL DSN for SQLAlchemy."""
        return (
            f"postgresql://{self.postgres_user}:{self.postgres_password}@"
            f"{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @property
    def is_development(self) -> bool:
        """Check if environment is development."""
        return self.environment.lower() == "development"

    @property
    def is_production(self) -> bool:
        """Check if environment is production."""
        return self.environment.lower() == "production"


# Create global settings instance
settings = Settings()