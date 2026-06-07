"""
Security helpers: password hashing (bcrypt) and JWT creation/validation.
Used by auth routes and protected transaction endpoints.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database import get_db
from app.models.user import User

# bcrypt context for hashing and verifying passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Token is sent as: Authorization: Bearer <jwt>
# We use HTTPBearer so Swagger UI shows a simple "Authorize" box where you paste the token.
# (OAuth2PasswordBearer would show username/password fields and expects form-encoded login,
# which we are not using in this project.)
bearer_scheme = HTTPBearer()


def hash_password(password: str) -> str:
    """Hash a plain-text password before storing it in the database."""
    # bcrypt only accepts up to 72 bytes. If we exceed that, the bcrypt backend can raise
    # "ValueError: password cannot be longer than 72 bytes".
    # We fail fast with a clear message instead of returning a 500 error.
    if len(password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Password too long. bcrypt supports a maximum of 72 bytes.",
        )
    try:
        return pwd_context.hash(password)
    except ValueError:
        # bcrypt itself can still raise if it thinks the input is >72 bytes.
        # Convert this into a clean validation-style error (instead of 500).
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Password too long. bcrypt supports a maximum of 72 bytes.",
        )


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compare a login password against the stored bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user_id: UUID) -> str:
    """Build a signed JWT containing the user's id as the subject (sub)."""
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    FastAPI dependency: decode JWT, load the user from DB, or reject the request.
    Attached to every protected transaction endpoint.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: Optional[str] = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == UUID(user_id)).first()
    if user is None:
        raise credentials_exception

    return user
