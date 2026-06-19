/**
 * CategoriesContext.jsx
 * Stores and manages categories (income sources and expense categories).
 * Fetches from GET /categories/ which returns personalized lists if the user
 * has a profile, or safe defaults if not.
 *
 * refreshCategories() — call this after saving profile changes (Settings page)
 *                       so TransactionForm dropdowns update immediately.
 */

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext.jsx";

const CategoriesContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Safe defaults shown when the user has no profile or on network error
const DEFAULTS = {
  income_sources: [
    "Gift", "Family Support", "Refund", "Selling Items", "Salary", "Freelance", "Other"
  ],
  expense_categories: [
    "Food", "Coffee", "Groceries", "Transport", "Going Out",
    "Subscriptions", "Shopping", "Personal Care", "Phone", "Gifts", "Travel", "Other"
  ],
};

async function fetchCategoriesFromApi(token) {
  if (!token) return DEFAULTS;

  try {
    const res = await fetch(`${API_URL}/categories/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return DEFAULTS;

    const data = await res.json();
    return {
      income_sources: data?.income_sources?.length ? data.income_sources : DEFAULTS.income_sources,
      expense_categories: data?.expense_categories?.length
        ? data.expense_categories
        : DEFAULTS.expense_categories,
    };
  } catch {
    return DEFAULTS;
  }
}

export function CategoriesProvider({ children }) {
  const { token } = useAuth();
  const [categories, setCategories] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCategoriesFromApi(token);
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [token]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const value = {
    categories,
    loading,
    initialized,
    refreshCategories: loadCategories,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }
  return ctx;
}
