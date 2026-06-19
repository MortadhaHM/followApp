"""
Pydantic schemas for user profile operations.
Validate incoming JSON for profile creation, reading, and updates.
"""

from typing import List, Optional

from pydantic import BaseModel


class ProfileBase(BaseModel):
    """Base profile fields."""

    situations: List[str]
    categories: List[str]
    income_sources: List[str]


class ProfileCreate(ProfileBase):
    """Body for POST /profile/ - create new profile."""
    pass


class ProfileUpdate(BaseModel):
    """Body for PUT /profile/ - update existing profile."""
    situations: Optional[List[str]] = None
    categories: Optional[List[str]] = None
    income_sources: Optional[List[str]] = None


class ProfileResponse(ProfileBase):
    """Profile response - includes timestamps."""

    id: str
    user_id: str
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}
