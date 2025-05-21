"""Health check endpoint routes."""

from fastapi import APIRouter, Depends
from loguru import logger
from sqlalchemy.ext.asyncio import AsyncSession

from ibc_ai.api.models.health import HealthResponse, ServiceStatus
from ibc_ai.data.database.session import get_db
from ibc_ai.version import get_version

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check(db: AsyncSession = Depends(get_db)) -> HealthResponse:
    """Check system health status.

    Returns:
        Health status information for all system components
    """
    logger.debug("Health check requested")

    # Check database connection
    db_status = ServiceStatus.OPERATIONAL
    db_message = "Connected to database"
    try:
        # Execute simple query to check database connection
        await db.execute("SELECT 1")
    except Exception as e:
        logger.error("Database health check failed: {}", str(e))
        db_status = ServiceStatus.FAILING
        db_message = f"Database connection failed: {str(e)}"

    # Additional service checks can be added here
    # For example, Neo4j connection, Vector DB, LLM API connectivity

    return HealthResponse(
        status="ok",
        version=get_version(),
        services={
            "database": {
                "status": db_status,
                "message": db_message,
            },
            # Add other services here as they are implemented
        },
    )