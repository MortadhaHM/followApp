"""
Database connection setup using SQLAlchemy (sync) and psycopg2.
Provides the Base class for models and a get_db dependency for routes.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings

# Sync engine — psycopg2 driver is specified in DATABASE_URL
engine = create_engine(settings.DATABASE_URL)

# Session factory — each request gets its own session via get_db()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class that all SQLAlchemy models inherit from
Base = declarative_base()


def get_db():
    """
    Yields a database session and closes it when the request finishes.
    Used as a FastAPI dependency in routers.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
