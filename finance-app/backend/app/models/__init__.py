"""
Import all models here so Alembic can discover them for migrations.
"""

from app.models.transaction import Transaction
from app.models.user import User

__all__ = ["User", "Transaction"]
