import { Navigate, Route, Routes } from "react-router-dom";

import App from "../App";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Navigate to="/login" replace />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      <Route
        path="/memos"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
