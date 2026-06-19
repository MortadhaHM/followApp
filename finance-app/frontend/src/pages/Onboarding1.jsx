/**
 * Onboarding1.jsx
 * First screen of onboarding flow: "What's your situation?"
 * Multi-select checkboxes for user life situations.
 * Selected situations are passed to Screen 2 via sessionStorage.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Situation definitions with labels and descriptions
const SITUATIONS = [
  {
    id: "student",
    label: "Student",
    description: "Managing tuition, books, and student life",
  },
  {
    id: "freelancer",
    label: "Freelancer",
    description: "Multiple income sources and client payments",
  },
  {
    id: "has_salary",
    label: "Has a salary",
    description: "Steady monthly income from employment",
  },
  {
    id: "in_a_relationship",
    label: "In a relationship",
    description: "Dates, gifts, shared expenses",
  },
  {
    id: "has_family",
    label: "Has a family",
    description: "Children, school fees, healthcare",
  },
];

export default function Onboarding1() {
  const navigate = useNavigate();
  const [selectedSituations, setSelectedSituations] = useState([]);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // If the user already has a profile, skip onboarding and go to dashboard
    const check = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }
      try {
        const res = await fetch(`${API_URL}/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          // Profile exists — skip onboarding
          navigate("/", { replace: true });
          return;
        }
      } catch {
        // Network error — allow onboarding to proceed
      }
      setChecking(false);
    };
    check();
  }, []);

  const toggleSituation = (id) => {
    setSelectedSituations((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (selectedSituations.length === 0) return;
    // Save selected situations to sessionStorage for Screen 2
    sessionStorage.setItem("onboarding_situations", JSON.stringify(selectedSituations));
    navigate("/onboarding-2");
  };

  // Don't render until we confirm the user needs onboarding
  if (checking) return null;

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
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
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>

        <h1 className="onboarding-title">Tell us about yourself</h1>
        <p className="onboarding-subtitle">
          We'll set up your categories based on your life situation.
        </p>

        <div className="onboarding-form">
          {SITUATIONS.map((situation) => (
            <label
              key={situation.id}
              className={`onboarding-checkbox ${selectedSituations.includes(situation.id) ? "active" : ""}`}
              onClick={() => toggleSituation(situation.id)}
            >
              <div className="checkbox-box">
                {selectedSituations.includes(situation.id) && (
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
                <span className="checkbox-label">{situation.label}</span>
                <span className="checkbox-desc">{situation.description}</span>
              </div>
            </label>
          ))}
        </div>

        <button
          className="btn btn--primary btn--full"
          onClick={handleNext}
          disabled={selectedSituations.length === 0}
        >
          Next →
        </button>

        <p className="onboarding-footer">
          You can change this later in Settings.
        </p>
      </div>
    </div>
  );
}
