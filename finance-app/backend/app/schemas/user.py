"""
Pydantic schemas for user registration, login, and auth responses.
Validate incoming JSON before it reaches the database layer.
"""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    """Body for POST /auth/register."""

    email: EmailStr
    # bcrypt has a hard limit of 72 BYTES for the input password.
    # To keep Phase 1 simple and avoid server-side 500 errors, we enforce a max length here.
    password: str = Field(min_length=6, max_length=72)


class UserLogin(BaseModel):
    """Body for POST /auth/login."""

    email: EmailStr
    # Same bcrypt limit as registration (keeps validation consistent).
    password: str = Field(max_length=72)


class Token(BaseModel):
    """JWT returned after successful register or login."""

    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """Public user info — never includes password."""

    id: UUID
    email: EmailStr
    created_at: datetime

    model_config = {"from_attributes": True}
