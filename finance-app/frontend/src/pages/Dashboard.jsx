/**
 * Dashboard.jsx
 * Protected main screen: sticky Navbar, two-column layout (form left, list right).
 *
 * On mount, checks if the user has completed onboarding (profile exists).
 * If not, redirects to /onboarding-1 so they can't skip it.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import TransactionForm from "../components/TransactionForm.jsx";
import TransactionList from "../components/TransactionList.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Dashboard() {
  const navigate = useNavigate();
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    // Check if user has a profile — redirect to onboarding if not
    const checkProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // ProtectedRoute will handle the redirect to /login

      try {
        const res = await fetch(`${API_URL}/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 404) {
          // No profile — redirect to onboarding
          navigate("/onboarding-1", { replace: true });
          return;
        }
      } catch {
        // On network error, allow dashboard to load normally
      }
      setProfileChecked(true);
    };

    checkProfile();
  }, []);

  // Don't render the dashboard until we've confirmed the profile exists
  if (!profileChecked) return null;

  return (
    <>
      <Navbar />
      <main className="container" id="main-content">
        <div className="main-layout">
          {/* Left: Add Transaction form */}
          <div>
            <TransactionForm onCreated={() => setRefreshSignal((n) => n + 1)} />
          </div>

          {/* Right: Summary + Transaction list */}
          <div>
            <TransactionList refreshSignal={refreshSignal} />
          </div>
        </div>
      </main>
    </>
  );
}
