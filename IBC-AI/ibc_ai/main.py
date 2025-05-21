"""Main FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ibc_ai.api.routes import api_router
from ibc_ai.config.settings import settings
from ibc_ai.core.logging import configure_logging

# Configure application logging
configure_logging()

# Create FastAPI application
app = FastAPI(
    title="IBC-AI Protocol Review System",
    description="AI-powered system for biosafety committee protocol review",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# Configure CORS
if settings.allowed_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[origin.strip() for origin in settings.allowed_origins.split(",")],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include API router
app.include_router(api_router, prefix="/api")


@app.get("/", tags=["Health"])
async def health_check() -> dict:
    """Basic health check endpoint."""
    return {"status": "ok", "version": "0.1.0"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)