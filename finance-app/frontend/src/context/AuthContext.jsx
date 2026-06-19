/**
 * AuthContext.jsx
 * Centralized auth state (JWT token) for the app.
 * Provides login/logout helpers and an isAuthenticated flag.
 *
 * login() — called after a normal sign-in. Checks if user already has a
 *           profile; if not, redirects to onboarding. Otherwise goes to /.
 * logout() — clears token and goes to /login.
 */

import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getInitialToken() {
  return localStorage.getItem("token");
}

async function hasProfile(token) {
  try {
    const res = await fetch(`${API_URL}/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok; // 200 → has profile, 404 → no profile
  } catch {
    return true; // on network error, don't block the user
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(getInitialToken);

  const login = async (newToken) => {
    if (!newToken) return;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    // After login, check if user already completed onboarding
    const profileExists = await hasProfile(newToken);
    if (!profileExists) {
      navigate("/onboarding-1", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
