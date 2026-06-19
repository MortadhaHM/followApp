"""
Categories routes: get user's categories from their profile.
Handles old accounts with default categories and new accounts with custom categories.

GET /categories/  - get current user's categories from their profile
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database import get_db
from app.models.profile import UserProfile
from app.models.user import User

router = APIRouter(prefix="/categories", tags=["categories"])

# Default categories for old accounts without profiles
DEFAULT_INCOME_SOURCES = ["Salary", "Freelance", "Investments", "Gifts", "Other"]
DEFAULT_EXPENSE_CATEGORIES = ["Food", "Rent", "Utilities", "Entertainment", "Transportation", "Shopping", "Other"]


@router.get("/", response_model=dict)
def get_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return the current user's categories from their profile.
    For old accounts without profiles, return default categories.
    """
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    
    if not profile:
        # Old account without profile - return defaults
        return {
            "income_sources": DEFAULT_INCOME_SOURCES,
            "expense_categories": DEFAULT_EXPENSE_CATEGORIES,
        }
    
    return {
        "income_sources": profile.income_sources or DEFAULT_INCOME_SOURCES,
        "expense_categories": profile.categories or DEFAULT_EXPENSE_CATEGORIES,
    }
