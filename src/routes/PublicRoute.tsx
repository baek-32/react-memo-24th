import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuthStore } from "../stores/useAuthStore";

interface PublicRouteProps {
  children: ReactNode;
}

function PublicRoute({ children }: PublicRouteProps) {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (accessToken) {
    return <Navigate to="/memos" replace />;
  }

  return children;
}

export default PublicRoute;