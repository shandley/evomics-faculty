"""Logging configuration for the application."""

import logging
import sys
from typing import Optional

from loguru import logger

from ibc_ai.config.settings import settings


class InterceptHandler(logging.Handler):
    """Logging handler to redirect Python logging to Loguru."""

    def emit(self, record: logging.LogRecord) -> None:
        """Emit log record using Loguru.

        Args:
            record: Log record to emit
        """
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back  # type: ignore
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(
            level, record.getMessage()
        )


def configure_logging() -> None:
    """Configure application logging."""
    log_level = settings.log_level.upper()

    # Configure Loguru
    logger.remove()
    logger.add(
        sys.stderr,
        level=log_level,
        format=(
            "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
            "<level>{level: <8}</level> | "
            "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
            "<level>{message}</level>"
        ),
        colorize=True,
        backtrace=settings.is_development,
        diagnose=settings.is_development,
    )

    # Add file logging in production
    if settings.is_production:
        logger.add(
            "logs/app.log",
            rotation="10 MB",
            retention="1 week",
            level=log_level,
            format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} - {message}",
        )

    # Intercept standard library logs
    logging.basicConfig(handlers=[InterceptHandler()], level=0, force=True)

    # Intercept common libraries
    for logger_name in (
        "uvicorn",
        "uvicorn.error",
        "fastapi",
        "sqlalchemy",
        "alembic",
    ):
        logging_logger = logging.getLogger(logger_name)
        logging_logger.handlers = [InterceptHandler()]

    logger.info("Logging configured with level: {}", log_level)