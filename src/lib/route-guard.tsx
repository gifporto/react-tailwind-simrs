"use client";

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export function ProtectedRoute() {
  const { token, loading } = useAuth();

  if (loading) return null; // bisa ganti loader

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  const { token, loading } = useAuth();

  if (loading) return null;

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
