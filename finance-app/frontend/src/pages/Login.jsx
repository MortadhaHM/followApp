/**
 * Login.jsx
 * Login page: collects email/password, calls /auth/login, stores JWT, redirects to Dashboard.
 */

import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { login as loginRequest } from "../api/auth.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const token = await loginRequest(email.trim(), password);
      if (!token) throw new Error("No token returned from server.");
      login(token);
    } catch (e2) {
      setError(e2.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <section className="card auth">
        <h1 className="card__title">Login</h1>

        {error ? <div className="alert alert--error">{error}</div> : null}

        <form className="form" onSubmit={handleSubmit}>
          <div className="form__field">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form__field">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn--primary" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="auth__footer">
          No account? <Link to="/register">Create one</Link>
        </div>
      </section>
    </div>
  );
}
