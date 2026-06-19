/**
 * Settings.jsx
 * User settings page to edit profile, situations, categories, and income sources.
 * Accessible from Navbar (Settings icon).
 *
 * Key behaviour:
 * - Loads existing profile on mount
 * - Changing situations does NOT auto-reset categories (user keeps their custom list)
 * - Save calls PUT /profile/ with all three fields independently
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../context/CategoriesContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import "../pages/Onboarding.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/* ── Icons ─────────────────────────────────────────── */
const WalletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 12V8H4a2 2 0 0 1 0-4h16v4"/>
    <path d="M4 6v14a2 2 0 0 0 2 2h14v-4"/>
    <circle cx="18" cy="14" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

// All available situations for the checkboxes
const ALL_SITUATIONS = [
  { id: "student",          label: "Student" },
  { id: "freelancer",       label: "Freelancer" },
  { id: "has_salary",       label: "Has a salary" },
  { id: "in_a_relationship",label: "In a relationship" },
  { id: "has_family",       label: "Has a family" },
];

export default function Settings() {
  const navigate = useNavigate();
  const { refreshCategories } = useCategories();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state — populated from API on mount
  const [selectedSituations, setSelectedSituations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [incomeSources, setIncomeSources] = useState([]);
  const [customCategory, setCustomCategory] = useState("");
  const [customIncomeSource, setCustomIncomeSource] = useState("");

  // Load profile from API on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setSelectedSituations(data.situations || []);
          setCategories(data.categories || []);
          setIncomeSources(data.income_sources || []);
        } else if (response.status === 404) {
          // No profile — initialize with empty state
          setProfile(null);
          setSelectedSituations([]);
          setCategories([]);
          setIncomeSources([
            "Gift", "Family Support", "Refund", "Selling Items", "Salary", "Freelance", "Other"
          ]);
        } else {
          throw new Error("Failed to load profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // NOTE: Intentionally NO useEffect on selectedSituations.
  // In settings, changing the situation checkboxes does NOT auto-reset categories.
  // Users manage their category list manually.

  const toggleSituation = (id) => {
    setSelectedSituations((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

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

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      let response;

      if (profile) {
        // Update existing profile
        response = await fetch(`${API_URL}/profile/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            situations: selectedSituations,
            categories,
            income_sources: incomeSources,
          }),
        });
      } else {
        // Create new profile (user skipped onboarding somehow)
        response = await fetch(`${API_URL}/profile/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            situations: selectedSituations,
            categories,
            income_sources: incomeSources,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to save profile");
      }

      const data = await response.json();
      setProfile(data);

      // Refresh categories context so TransactionForm dropdowns update immediately
      await refreshCategories();

      setSaved(true);
      setError("");
    } catch (err) {
      console.error("Error saving settings:", err);
      setError(err.message || "Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-page">
        <div className="loading-container">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <header className="navbar" role="banner">
        <div className="navbar__inner">
          <a href="/" className="navbar__brand" aria-label="FinanceFlow home">
            <span className="navbar__brand-icon" aria-hidden="true">
              <WalletIcon />
            </span>
            <span>FinanceFlow</span>
          </a>

          <div className="navbar__actions">
            <button
              className="btn btn--secondary navbar-btn"
              onClick={() => navigate("/")}
              aria-label="Go to dashboard"
            >
              <HomeIcon />
              <span style={{ marginLeft: "6px" }}>Dashboard</span>
            </button>
            <ThemeToggle />
            <button
              className="btn btn--secondary"
              onClick={logout}
              type="button"
              id="logout-btn"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="settings-content">
        <div className="settings-card">
          {error && (
            <div className="onboarding-error" role="alert" style={{ marginBottom: "16px" }}>
              {error}
            </div>
          )}

          {saved && (
            <div className="onboarding-success" role="status" style={{ marginBottom: "16px" }}>
              ✓ Settings saved successfully!
            </div>
          )}

          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your profile and personalized categories</p>

          {/* Situations */}
          <div className="settings-section">
            <h3 className="section-title">Your Situation</h3>
            <p className="section-hint">
              Changing your situation won't reset your categories — manage them below.
            </p>
            <div className="onboarding-form" style={{ marginTop: "12px" }}>
              {ALL_SITUATIONS.map((sit) => (
                <label
                  key={sit.id}
                  className={`onboarding-checkbox ${selectedSituations.includes(sit.id) ? "active" : ""}`}
                  onClick={() => toggleSituation(sit.id)}
                >
                  <div className="checkbox-box">
                    {selectedSituations.includes(sit.id) && (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div className="checkbox-content">
                    <span className="checkbox-label">{sit.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="settings-section">
            <h3 className="section-title">Expense Categories</h3>
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

          {/* Income Sources */}
          <div className="settings-section">
            <h3 className="section-title">Income Sources</h3>
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

          <div className="settings-actions">
            <button
              className="btn btn--primary"
              onClick={handleSave}
              disabled={saving}
              id="save-settings-btn"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
