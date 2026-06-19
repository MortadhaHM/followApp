"""
Profile routes: create, read, and update user profile.
Handles adaptive onboarding and personalized categories.

POST /profile/  - create profile after onboarding
GET /profile/   - get current user's profile
PUT /profile/   - update profile and categories
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database import get_db
from app.models.profile import UserProfile
from app.models.user import User
from app.schemas.profile import ProfileCreate, ProfileResponse, ProfileUpdate

router = APIRouter(prefix="/profile", tags=["profile"])

# Predefined category sets per situation
SITUATION_CATEGORIES = {
    "student": [
        "Food", "Coffee", "Groceries", "Transport", "Going Out",
        "Subscriptions", "Shopping", "Personal Care", "Phone", "Gifts", "Travel", "Other"
    ],
    "freelancer": [
        "Food", "Coffee", "Transport", "Subscriptions", "Phone",
        "Bills", "Shopping", "Personal Care", "Gifts", "Travel", "Other"
    ],
    "has_salary": [
        "Food", "Coffee", "Groceries", "Transport", "Going Out",
        "Subscriptions", "Shopping", "Personal Care", "Rent", "Bills",
        "Phone", "Gifts", "Travel", "Other"
    ],
    "in_a_relationship": [
        "Food", "Coffee", "Transport", "Going Out", "Dates", "Gifts",
        "Travel", "Subscriptions", "Shopping", "Phone", "Other"
    ],
    "has_family": [
        "Food", "Groceries", "Transport", "Rent", "Bills", "Phone",
        "Gifts", "Travel", "Shopping", "Personal Care", "Other"
    ],
}

# Default income sources (same for all situations)
DEFAULT_INCOME_SOURCES = [
    "Gift", "Family Support", "Refund", "Selling Items", "Salary", "Freelance", "Other"
]


def merge_categories(situations: list[str]) -> list[str]:
    """
    Merge categories from multiple situations, remove duplicates,
    and ensure 'Other' is at the end if present.
    """
    merged = set()
    for situation in situations:
        if situation in SITUATION_CATEGORIES:
            merged.update(SITUATION_CATEGORIES[situation])

    result = [cat for cat in merged if cat != "Other"]
    if "Other" in merged:
        result.append("Other")
    return result


def ensure_other_at_end(items: list[str]) -> list[str]:
    """Move 'Other' to the end; add it if absent."""
    without_other = [x for x in items if x != "Other"]
    return without_other + ["Other"]


@router.post("/", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
def create_profile(
    profile_data: ProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new user profile after onboarding.
    Uses the categories and income_sources lists sent by the frontend
    (which the user already edited on Screen 2). Ensures 'Other' is
    present at the end of both lists.
    """
    # Check if profile already exists
    existing = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile already exists",
        )

    # Honour the user-edited lists from the frontend; just ensure 'Other' is at the end
    categories = ensure_other_at_end(profile_data.categories)
    income_sources = ensure_other_at_end(profile_data.income_sources)

    profile = UserProfile(
        user_id=current_user.id,
        situations=profile_data.situations,
        categories=categories,
        income_sources=income_sources,
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)

    return {
        "id": str(profile.id),
        "user_id": str(profile.user_id),
        "situations": profile.situations,
        "categories": profile.categories,
        "income_sources": profile.income_sources,
        "created_at": profile.created_at.isoformat(),
        "updated_at": profile.updated_at.isoformat(),
    }


@router.get("/", response_model=ProfileResponse)
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return the current user's profile, or 404 if not set."""
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found",
        )

    return {
        "id": str(profile.id),
        "user_id": str(profile.user_id),
        "situations": profile.situations,
        "categories": profile.categories,
        "income_sources": profile.income_sources,
        "created_at": profile.created_at.isoformat(),
        "updated_at": profile.updated_at.isoformat(),
    }


@router.put("/", response_model=ProfileResponse)
def update_profile(
    profile_data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update an existing profile.
    - If only situations change, categories are NOT auto-reset (user keeps their edits).
    - categories and income_sources are updated independently if provided.
    """
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found",
        )

    update_data = profile_data.model_dump(exclude_unset=True)

    if "situations" in update_data:
        profile.situations = update_data["situations"]

    if "categories" in update_data:
        profile.categories = ensure_other_at_end(update_data["categories"])

    if "income_sources" in update_data:
        profile.income_sources = ensure_other_at_end(update_data["income_sources"])

    db.commit()
    db.refresh(profile)

    return {
        "id": str(profile.id),
        "user_id": str(profile.user_id),
        "situations": profile.situations,
        "categories": profile.categories,
        "income_sources": profile.income_sources,
        "created_at": profile.created_at.isoformat(),
        "updated_at": profile.updated_at.isoformat(),
    }
