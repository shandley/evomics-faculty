"""API routes module."""

from fastapi import APIRouter

from .health import router as health_router

# Create main API router
api_router = APIRouter()

# Include all route modules
api_router.include_router(health_router, tags=["Health"])

# Import and include other router modules here as they are created
# api_router.include_router(protocol_router, prefix="/protocols", tags=["Protocols"])
# api_router.include_router(knowledge_router, prefix="/knowledge", tags=["Knowledge Base"])
# api_router.include_router(risk_router, prefix="/risk", tags=["Risk Assessment"])