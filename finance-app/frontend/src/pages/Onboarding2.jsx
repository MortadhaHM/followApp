import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../context/CategoriesContext.jsx";
import "./Onboarding.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Default income sources
const DEFAULT_INCOME_SOURCES = [
  "Gift", "Family Support", "Refund", "Selling Items", "Salary", "Freelance", "Other"
];

// Situation categories mapping (mirrors backend SITUATION_CATEGORIES)
const SITUATION_CATEGORIES = {
  student: [
    "Food", "Coffee", "Groceries", "Transport", "Going Out",
    "Subscriptions", "Shopping", "Personal Care", "Phone", "Gifts", "Travel", "Other"
  ],
  freelancer: [
    "Food", "Coffee", "Transport", "Subscriptions", "Phone",
    "Bills", "Shopping", "Personal Care", "Gifts", "Travel", "Other"
  ],
  has_salary: [
    "Food", "Coffee", "Groceries", "Transport", "Going Out",
    "Subscriptions", "Shopping", "Personal Care", "Rent", "Bills",
    "Phone", "Gifts", "Travel", "Other"
  ],
  in_a_relationship: [
    "Food", "Coffee", "Transport", "Going Out", "Dates", "Gifts",
    "Travel", "Subscriptions", "Shopping", "Phone", "Other"
  ],
  has_family: [
    "Food", "Groceries", "Transport", "Rent", "Bills", "Phone",
    "Gifts", "Travel", "Shopping", "Personal Care", "Other"
  ],
};

export default function Onboarding2() {
  const navigate = useNavigate();
  const { refreshCategories } = useCategories();
  const [situations, setSituations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [incomeSources, setIncomeSources] = useState([]);
  const [customCategory, setCustomCategory] = useState("");
  const [customIncomeSource, setCustomIncomeSource] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load situations from sessionStorage (set by Onboarding1)
    const saved = sessionStorage.getItem("onboarding_situations");
    if (!saved) {
      // Guard: if no situations, go back to step 1
      navigate("/onboarding-1", { replace: true });
      return;
    }
    const parsed = JSON.parse(saved);
    setSituations(parsed);

    // Merge categories from all selected situations, deduplicated, Other at end
    const merged = new Set();
    parsed.forEach((sit) => {
      if (SITUATION_CATEGORIES[sit]) {
        SITUATION_CATEGORIES[sit].forEach((cat) => merged.add(cat));
      }
    });
    const catArray = Array.from(merged).filter((c) => c !== "Other");
    if (merged.has("Other")) catArray.push("Other");
    setCategories(catArray);

    // Income sources — use defaults with Other at the end
    const incomeArray = DEFAULT_INCOME_SOURCES.filter((i) => i !== "Other");
    incomeArray.push("Other");
    setIncomeSources(incomeArray);
  }, []);

  const removeCategory = (category) => {
    setCategories((prev) => prev.filter((c) => c !== category));
  };

  const removeIncomeSource = (source) => {
    setIncomeSources((prev) => prev.filter((s) => s !== source));
  };

  const addCustomCategory = () => {
    if (!customCategory.trim()) return;
    const trimmed = customCategory.trim();
    if (!categories.includes(trimmed)) {
      // Insert before "Other" if present
      const withoutOther = categories.filter((c) => c !== "Other");
      const hasOther = categories.includes("Other");
      setCategories(hasOther ? [...withoutOther, trimmed, "Other"] : [...withoutOther, trimmed]);
    }
    setCustomCategory("");
  };

  const addCustomIncomeSource = () => {
    if (!customIncomeSource.trim()) return;
    const trimmed = customIncomeSource.trim();
    if (!incomeSources.includes(trimmed)) {
      const withoutOther = incomeSources.filter((s) => s !== "Other");
      const hasOther = incomeSources.includes("Other");
      setIncomeSources(hasOther ? [...withoutOther, trimmed, "Other"] : [...withoutOther, trimmed]);
    }
    setCustomIncomeSource("");
  };

  const handleDone = async () => {
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated — please log in again.");

      // Send the user-edited lists as-is; backend saves them directly
      const response = await fetch(`${API_URL}/profile/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          situations,
          categories,
          income_sources: incomeSources,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to create profile");
      }

      // Refresh categories context to load newly created categories
      if (typeof refreshCategories === "function") {
        await refreshCategories();
      }

      // Clear sessionStorage and go to dashboard
      sessionStorage.removeItem("onboarding_situations");
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Error creating profile:", err);
      setError(err.message || "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-card onboarding-card--wide">
        <div className="onboarding-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
          </svg>
        </div>

        <h1 className="onboarding-title">Here are your categories</h1>
        <p className="onboarding-subtitle">
          Remove what you don't need, add what's missing.
        </p>

        {error && (
          <div className="onboarding-error" role="alert">
            {error}
          </div>
        )}

        {/* Categories section */}
        <div className="onboarding-section">
          <h3 className="onboarding-section-title">Expense Categories</h3>
          <div className="tags-container">
            {categories.map((cat) => (
              <span key={cat} className="tag">
                {cat}
                <button
                  type="button"
                  className="tag-remove"
                  onClick={() => removeCategory(cat)}
                  aria-label={`Remove ${cat}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="add-custom-input">
            <input
              type="text"
              placeholder="Add custom category..."
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomCategory()}
              className="onboarding-input"
            />
            <button
              type="button"
              className="btn btn--secondary"
              onClick={addCustomCategory}
            >
              Add
            </button>
          </div>
        </div>

        {/* Income sources section */}
        <div className="onboarding-section">
          <h3 className="onboarding-section-title">Income Sources</h3>
          <div className="tags-container">
            {incomeSources.map((source) => (
              <span key={source} className="tag">
                {source}
                <button
                  type="button"
                  className="tag-remove"
                  onClick={() => removeIncomeSource(source)}
                  aria-label={`Remove ${source}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="add-custom-input">
            <input
              type="text"
              placeholder="Add custom income source..."
              value={customIncomeSource}
              onChange={(e) => setCustomIncomeSource(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomIncomeSource()}
              className="onboarding-input"
            />
            <button
              type="button"
              className="btn btn--secondary"
              onClick={addCustomIncomeSource}
            >
              Add
            </button>
          </div>
        </div>

        <button
          className="btn btn--primary btn--full"
          onClick={handleDone}
          disabled={saving || categories.length === 0}
        >
          {saving ? "Saving…" : "Done"}
        </button>
      </div>
    </div>
  );
}
