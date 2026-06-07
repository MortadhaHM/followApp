/**
 * AuthContext.jsx
 * Centralized auth state (JWT token) for the app.
 * Provides login/logout helpers and an isAuthenticated flag.
 */

import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

function getInitialToken() {
  return localStorage.getItem("token");
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(getInitialToken);

  const login = (newToken) => {
    if (!newToken) return;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    navigate("/", { replace: true });
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
    [token]
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

