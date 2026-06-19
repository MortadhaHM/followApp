"""
SQLAlchemy model for the user_profile table.
Stores user's life situation, personalized categories, and income sources.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, String, UUID
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class UserProfile(Base):
    """User profile with personalized categories and income sources."""

    __tablename__ = "user_profile"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    situations = Column(ARRAY(String), nullable=False, default=[])
    categories = Column(ARRAY(String), nullable=False, default=[])
    income_sources = Column(ARRAY(String), nullable=False, default=[])
    created_at = Column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=func.now(),
        onupdate=func.now(),
    )

    # One user has one profile
    user = relationship("User", backref="profile")
