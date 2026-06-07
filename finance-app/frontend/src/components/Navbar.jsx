/**
 * Navbar.jsx
 * Simple top navigation bar with app title and a logout button.
 */

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          Personal Finance
        </Link>

        {isAuthenticated ? (
          <button className="btn btn--secondary" onClick={logout} type="button">
            Logout
          </button>
        ) : null}
      </div>
    </header>
  );
}

