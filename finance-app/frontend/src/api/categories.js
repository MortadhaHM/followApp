/**
 * categories.js
 * Fetches static income sources and expense categories for dropdowns.
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
    throw new Error(`Failed to load categories (${res.status})`);
  }

  const data = await res.json();
  // Expected backend shape:
  // { income_sources: string[], expense_categories: string[] }
  return {
    income_sources: data?.income_sources || [],
    expense_categories: data?.expense_categories || [],
  };
}

