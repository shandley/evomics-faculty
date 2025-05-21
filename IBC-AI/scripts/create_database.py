#!/usr/bin/env python
"""Create database tables for development."""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from loguru import logger
from sqlalchemy import text

from ibc_ai.data.database.base import Base
from ibc_ai.data.database.session import engine


async def create_tables() -> None:
    """Create all database tables."""
    logger.info("Creating database tables...")

    # Import all models to ensure they are registered with the metadata
    # Add your model imports here as they are created
    # from ibc_ai.data.models.protocol import Protocol
    # from ibc_ai.data.models.user import User

    async with engine.begin() as conn:
        # Create tables
        await conn.run_sync(Base.metadata.create_all)

        # Check connection
        result = await conn.execute(text("SELECT 1"))
        logger.info("Database connection test: {}", result.scalar())

    logger.info("Database tables created successfully")


if __name__ == "__main__":
    """Run the database creation script."""
    asyncio.run(create_tables())