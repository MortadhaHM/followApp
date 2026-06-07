/**
 * Register.jsx
 * Registration page: collects email/password, calls /auth/register, then redirects to /login.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerRequest } from "../api/auth.js";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await registerRequest(email.trim(), password);
      navigate("/login", { replace: true });
    } catch (e2) {
      setError(e2.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <section className="card auth">
        <h1 className="card__title">Register</h1>

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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn--primary" type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="auth__footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </section>
    </div>
  );
}

