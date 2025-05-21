"""Version information for the application."""

import importlib.metadata
from typing import Any


def get_version() -> str:
    """Get the current application version.

    Returns:
        The current version string
    """
    try:
        return importlib.metadata.version("ibc-ai")
    except importlib.metadata.PackageNotFoundError:
        # Package is not installed, return a default version
        return "0.1.0-dev"


# Add more version-related functions here if needed
def get_versions_info() -> dict[str, Any]:
    """Get version information for key dependencies.

    Returns:
        A dictionary with version information
    """
    packages = [
        "fastapi",
        "langchain",
        "pydantic",
        "sqlalchemy",
        "neo4j",
        "transformers",
        "sentence-transformers",
    ]

    versions = {}
    for package in packages:
        try:
            versions[package] = importlib.metadata.version(package)
        except importlib.metadata.PackageNotFoundError:
            versions[package] = "not installed"

    return {
        "ibc_ai": get_version(),
        "dependencies": versions,
    }