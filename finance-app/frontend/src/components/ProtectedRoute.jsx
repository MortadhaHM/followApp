/**
 * ProtectedRoute.jsx
 * Simple route guard that checks localStorage for a JWT.
 * If missing, redirects the user to /login.
 */

import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

