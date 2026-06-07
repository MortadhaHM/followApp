"""
Pydantic schemas for creating, updating, and returning transactions.
"""

from datetime import date as date_type, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.transaction import TransactionType


class TransactionCreate(BaseModel):
    """Body for POST /transactions/."""

    type: TransactionType
    amount: Decimal = Field(gt=0)
    category_or_source: str = Field(min_length=1)
    description: str | None = None
    tags: str | None = None
    date: date_type


class TransactionUpdate(BaseModel):
    """Body for PUT /transactions/{id} — all fields optional for partial updates."""

    type: TransactionType | None = None
    amount: Decimal | None = Field(default=None, gt=0)
    category_or_source: str | None = Field(default=None, min_length=1)
    description: str | None = None
    tags: str | None = None
    date: date_type | None = None


class TransactionResponse(BaseModel):
    """Single transaction returned from the API."""

    id: UUID
    user_id: UUID
    type: TransactionType
    amount: Decimal
    category_or_source: str
    description: str | None
    tags: str | None
    date: date_type
    created_at: datetime

    model_config = {"from_attributes": True}
