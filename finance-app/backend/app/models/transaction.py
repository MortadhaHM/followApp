"""
SQLAlchemy model for the transactions table.
Each row is a single income or expense record belonging to one user.
"""

import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, Date, DateTime, Enum, ForeignKey, Numeric, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class TransactionType(str, enum.Enum):
    """Allowed transaction types — stored as PostgreSQL enum values."""

    income = "income"
    expense = "expense"


class Transaction(Base):
    """Financial transaction (income or expense) linked to a user."""

    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    type = Column(Enum(TransactionType, name="transactiontype"), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    # Plain string — income source or expense category, no separate lookup table
    category_or_source = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    tags = Column(Text, nullable=True)
    date = Column(Date, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    user = relationship("User", back_populates="transactions")
