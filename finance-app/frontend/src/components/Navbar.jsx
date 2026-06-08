/**
 * Navbar.jsx
 * Top navigation with brand logo, app name, and theme toggle + logout.
 */

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const WalletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 12V8H4a2 2 0 0 1 0-4h16v4"/>
    <path d="M4 6v14a2 2 0 0 0 2 2h14v-4"/>
    <circle cx="18" cy="14" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="navbar" role="banner">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="FinanceFlow home">
          <span className="navbar__brand-icon" aria-hidden="true">
            <WalletIcon />
          </span>
          <span>FinanceFlow</span>
        </Link>

        <div className="navbar__actions">
          <ThemeToggle />
          {isAuthenticated ? (
            <button
              className="btn btn--secondary"
              onClick={logout}
              type="button"
              id="logout-btn"
            >
              Sign out
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
