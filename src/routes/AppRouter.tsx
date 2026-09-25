import { Navigate, Route, Routes } from "react-router-dom";

import App from "../App";
import LoginPage from "../pages/LoginPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/memos" element={<App />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRouter;
