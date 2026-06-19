/**
 * categories.js
 * Fetches personalized income sources and expense categories from user profile.
 * Falls back to defaults if no profile exists.
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getToken() {
  return localStorage.getItem("token");
}

export async function fetchCategories() {
  const token = getToken();
  const res = await fetch(`${API_URL}/categories`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    // Fallback to defaults if categories endpoint fails
    return {
      income_sources: ["Salary", "Freelance", "Investments", "Gifts", "Other"],
      expense_categories: ["Food", "Rent", "Utilities", "Entertainment", "Transportation", "Shopping", "Other"],
    };
  }

  const data = await res.json();
  return {
    income_sources: data?.income_sources?.length ? data.income_sources : ["Salary", "Freelance", "Investments", "Gifts", "Other"],
    expense_categories: data?.expense_categories?.length ? data.expense_categories : ["Food", "Rent", "Utilities", "Entertainment", "Transportation", "Shopping", "Other"],
  };
}
