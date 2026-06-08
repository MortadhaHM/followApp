/**
 * Register.jsx
 * Split-layout registration page matching Login design language.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerRequest } from "../api/auth.js";
import ThemeToggle from "../components/ThemeToggle.jsx";

/* ── Icons ─────────────────────────────────────────── */
const WalletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 12V8H4a2 2 0 0 1 0-4h16v4"/>
    <path d="M4 6v14a2 2 0 0 0 2 2h14v-4"/>
    <circle cx="18" cy="14" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await registerRequest(email.trim(), password);
      setSuccess(true);
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (e2) {
      setError(e2.message || "Registration failed — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── Left illustration panel ── */}
      <aside className="auth-panel" aria-hidden="true">
        <div className="auth-panel__logo">
          <div className="auth-panel__logo-icon">
            <WalletIcon />
          </div>
          <span className="auth-panel__logo-text">FinanceFlow</span>
        </div>

        <h1 className="auth-panel__heading">
          Start your<br />financial journey.
        </h1>
        <p className="auth-panel__sub">
          Join thousands of people who've taken control of their money. It's free, private, and takes under a minute.
        </p>

        <ul className="auth-panel__features" aria-label="Benefits">
          {[
            "Free forever — no credit card needed",
            "Your data is encrypted and private",
            "Set up in under 60 seconds",
            "Available on any device, any time",
          ].map((feat) => (
            <li key={feat} className="auth-panel__feature">
              <span className="auth-panel__feature-dot" />
              {feat}
            </li>
          ))}
        </ul>
      </aside>

      {/* ── Right form panel ── */}
      <main className="auth-form-panel">
        <div className="auth-form-wrap">
          {/* Mobile logo */}
          <div className="auth-mobile-logo">
            <div className="auth-mobile-logo__icon">
              <WalletIcon />
            </div>
            FinanceFlow
          </div>

          {/* Theme toggle */}
          <div style={{ position: "fixed", top: 16, right: 16, zIndex: 50 }}>
            <ThemeToggle />
          </div>

          <div>
            <h2 className="auth-heading">Create your account</h2>
            <p className="auth-sub">It's free and takes less than a minute.</p>
          </div>

          {error ? (
            <div className="alert alert--error" role="alert">{error}</div>
          ) : null}

          {success ? (
            <div
              className="alert"
              role="status"
              style={{
                borderColor: "var(--success)",
                background: "var(--success-bg)",
                color: "var(--success)",
              }}
            >
              Account created! Redirecting to sign in…
            </div>
          ) : null}

          <form className="form" onSubmit={handleSubmit} id="register-form" noValidate>
            <div className="form__field">
              <label className="label" htmlFor="email">Email address</label>
              <div className="input-wrapper">
                <span className="input-icon"><MailIcon /></span>
                <input
                  id="email"
                  className="input input--with-icon"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form__field">
              <label className="label" htmlFor="password">
                Password
                <span style={{ opacity: 0.6, fontWeight: 400, fontSize: 12, marginLeft: 6 }}>
                  (min. 8 characters)
                </span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon"><LockIcon /></span>
                <input
                  id="password"
                  className="input input--with-icon input--with-icon-right"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button
              className="btn btn--primary btn--full"
              type="submit"
              id="register-submit"
              disabled={submitting || success}
            >
              {submitting ? (
                <>
                  <span className="spinner" />
                  Creating account…
                </>
              ) : (
                <>
                  <SparkleIcon />
                  Create free account
                </>
              )}
            </button>
          </form>

          <p className="auth__footer">
            Already have an account?{" "}
            <Link to="/login" id="login-link">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
