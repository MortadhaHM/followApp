/**
 * AuthContext.jsx
 * Centralized auth state (JWT token) for the app.
 * Provides login/logout helpers and an isAuthenticated flag.
 *
 * login()               — called after a normal sign-in. Checks if user already
 *                         has a profile; if not, redirects to onboarding.
 * logout()              — clears token and goes to /login.
 * handleUnauthorized()  — called by API helpers when a 401 is received.
 *                         Clears the expired/invalid token and redirects to /login.
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/** Read the stored token (may be expired). */
function getInitialToken() {
  return localStorage.getItem("token");
}

/**
 * Decode the JWT payload (no verification — that's the server's job).
 * Returns null if the token is missing or malformed.
 */
function decodePayload(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

/** Returns true if the JWT exp claim is in the past. */
function isTokenExpired(token) {
  const payload = decodePayload(token);
  if (!payload?.exp) return true;
  // exp is in seconds; Date.now() is in milliseconds
  return Date.now() >= payload.exp * 1000;
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

  /**
   * On mount, check if the stored token has already expired.
   * If so, clear it immediately so the user lands on /login
   * instead of seeing a broken dashboard with 401 errors.
   * Also register the module-level unauthorized handler so API files
   * (which can't use React hooks) can trigger auto-logout.
   */
  useEffect(() => {
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("token");
      setToken(null);
      navigate("/login", { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep module-level handler in sync with the latest handleUnauthorized
  useEffect(() => {
    setUnauthorizedHandler(handleUnauthorized);
  }); // no dep array — runs every render so closures are always fresh

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

  /**
   * Called by API helpers when the server returns 401.
   * Clears the stale token and sends the user back to /login with a message.
   */
  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login?expired=1", { replace: true });
  };

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
      handleUnauthorized,
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

/**
 * A module-level hook so non-React API files can trigger a logout.
 * Call setUnauthorizedHandler(handleUnauthorized) once from AuthProvider,
 * then API modules can import and call onUnauthorized().
 */
let _onUnauthorized = null;
export function setUnauthorizedHandler(fn) {
  _onUnauthorized = fn;
}
export function onUnauthorized() {
  if (_onUnauthorized) _onUnauthorized();
}
