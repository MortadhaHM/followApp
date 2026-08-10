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
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Dashboard() {
  const navigate = useNavigate();
  const { handleUnauthorized } = useAuth();
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [profileChecked, setProfileChecked] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    // Check if user has a profile — redirect to onboarding if not
    const checkProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // ProtectedRoute will handle the redirect to /login

      try {
        const res = await fetch(`${API_URL}/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          // Token expired — auto-logout
          handleUnauthorized();
          return;
        }
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
          {/* Left: Add / Edit Transaction form */}
          <div>
            <TransactionForm
              onCreated={() => setRefreshSignal((n) => n + 1)}
              editingTransaction={editingTransaction}
              onCancelEdit={() => setEditingTransaction(null)}
            />
          </div>

          {/* Right: Summary + Transaction list */}
          <div>
            <TransactionList
              refreshSignal={refreshSignal}
              onEdit={(tx) => {
                setEditingTransaction(tx);
                // Scroll the form into view on mobile
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        </div>
      </main>
    </>
  );
}
