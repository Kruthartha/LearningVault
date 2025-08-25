// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    // Not logged in → send to login page
    return <Navigate to="/login" replace />;
  }

  // Logged in → show the page
  return children;
};

export default ProtectedRoute;