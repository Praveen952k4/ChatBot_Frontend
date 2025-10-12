// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useApp } from "@/contexts/AppContext"; // Your App context

export const ProtectedRoute = () => {
  const { user } = useApp(); // Check if the user is logged in

  if (!user) {
    // If not logged in, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the child component (e.g., the Chat page)
  return <Outlet />;
};