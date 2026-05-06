// src/components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * usage:
 * <Route path="/seller-dashboard" element={<ProtectedRoute role="seller"><SellerDashboard/></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (role && user.role !== role && user.role !== "admin") {
    // admin can access everything
    return <Navigate to="/" replace />;
  }
  return children;
}
