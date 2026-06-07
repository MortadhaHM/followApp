"""
FastAPI application entry point.
Wires routers, CORS, and the static categories endpoint.
Run with: uvicorn app.main:app --reload
"""

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, transactions

# Predefined dropdown values for the frontend — not stored in the database
INCOME_SOURCES = [
    "Gift",
    "Family Support",
    "Refund",
    "Selling Items",
    "Salary",
    "Freelance",
    "Other",
]

EXPENSE_CATEGORIES = [
    "Food",
    "Coffee",
    "Groceries",
    "Transport",
    "Going Out",
    "Dates",
    "Friends",
    "Subscriptions",
    "Shopping",
    "Personal Care",
    "Rent",
    "Bills",
    "Phone",
    "Gifts",
    "Travel",
    "Other",
]

app = FastAPI(
    title="Personal Finance API",
    description="Phase 1 backend — auth and transaction tracking",
    version="1.0.0",
)

# Allow all origins during local development (frontend on any localhost port)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount route modules
app.include_router(auth.router)
app.include_router(transactions.router)


@app.get("/categories")
def get_categories():
    """
    Return static income sources and expense categories for frontend dropdowns.
    No database table — just predefined lists.
    """
    return {
        "income_sources": INCOME_SOURCES,
        "expense_categories": EXPENSE_CATEGORIES,
}


@app.get("/")
def root():
    """Simple health check — confirms the API is running."""
    return {"status": "ok", "message": "Personal Finance API"}


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    """
    Browsers automatically request /favicon.ico.
    We don't serve a favicon in Phase 1, so return 204 to avoid noisy 404 logs.
    """
    return Response(status_code=204)
