/**
 * Navbar.jsx
 * Top navigation with brand logo, app name, settings, and logout.
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

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
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
          {isAuthenticated && (
            <Link to="/settings" className="btn btn--secondary navbar-btn" aria-label="Settings">
              <SettingsIcon />
              <span style={{ marginLeft: "6px" }}>Settings</span>
            </Link>
          )}
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
