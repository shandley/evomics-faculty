#!/usr/bin/env python
"""Create database tables for development."""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from loguru import logger
from sqlalchemy import text

from ibc_ai.data.database.session import engine
from ibc_ai.data.models.base import Base


async def create_tables() -> None:
    """Create all database tables."""
    logger.info("Creating database tables...")

    # Import all models to ensure they are registered with the metadata
    from ibc_ai.data.models.biological_agent import BiologicalAgentModel
    from ibc_ai.data.models.protocol import ProtocolModel, ProtocolDocumentModel, ProtocolBiologicalAgentModel

    async with engine.begin() as conn:
        # Create tables
        await conn.run_sync(Base.metadata.create_all)

        # Check connection
        result = await conn.execute(text("SELECT 1"))
        logger.info("Database connection test: {}", result.scalar())

    logger.info("Database tables created successfully")


async def drop_tables() -> None:
    """Drop all database tables."""
    logger.warning("Dropping all database tables...")

    # Import all models to ensure they are registered with the metadata
    from ibc_ai.data.models.biological_agent import BiologicalAgentModel
    from ibc_ai.data.models.protocol import ProtocolModel, ProtocolDocumentModel, ProtocolBiologicalAgentModel

    async with engine.begin() as conn:
        # Drop tables
        await conn.run_sync(Base.metadata.drop_all)

    logger.info("Database tables dropped successfully")


if __name__ == "__main__":
    """Run the database creation script."""
    if len(sys.argv) > 1 and sys.argv[1] == "drop":
        asyncio.run(drop_tables())
    else:
        asyncio.run(create_tables())