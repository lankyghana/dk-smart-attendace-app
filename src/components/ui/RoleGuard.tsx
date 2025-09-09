import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface RoleGuardProps {
  allowedRoles: string[];
  fallback?: string;
  children: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, fallback = "/login", children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or a spinner

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return <Navigate to={fallback} state={{ from: location, error: "Unauthorized access" }} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
