import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

export default function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: ReactNode;
  adminOnly?: boolean;
}) {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="section"><p>Checking your account...</p></div>;
  if (!user || !token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/products" replace />;
  }
  return <>{children}</>;
}
