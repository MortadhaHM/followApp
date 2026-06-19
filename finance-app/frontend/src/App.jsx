/**
 * App.jsx
 * Top-level routes wrapped in ThemeProvider and CategoriesProvider.
 *
 * Route protection:
 *  - /onboarding-1, /onboarding-2 → require a token (post-registration)
 *  - /settings                    → requires a token
 *  - /                            → requires a token (handled by ProtectedRoute)
 *  - /login, /register            → public
 */

import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Onboarding1 from "./pages/Onboarding1.jsx";
import Onboarding2 from "./pages/Onboarding2.jsx";
import Settings from "./pages/Settings.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { CategoriesProvider } from "./context/CategoriesContext.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <CategoriesProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes — require a JWT token */}
          <Route
            path="/onboarding-1"
            element={
              <ProtectedRoute>
                <Onboarding1 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding-2"
            element={
              <ProtectedRoute>
                <Onboarding2 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CategoriesProvider>
    </ThemeProvider>
  );
}
