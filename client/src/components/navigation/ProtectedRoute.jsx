// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../../pages/LoadingScreen";

const API_URL = import.meta.env.VITE_API_URL;

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // Validate access token by calling /auth/me
  const validateAccessToken = async (token) => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data.user));
        return true;
      } else if (res.status === 401) {
        // Access token expired → try refresh
        return await refreshAccessToken();
      } else {
        return false;
      }
    } catch (err) {
      console.error("Auth validation error:", err);
      return false;
    }
  };

  // Call refresh endpoint; cookie is sent automatically
  const refreshAccessToken = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include", // important to send cookie
      });

      if (!res.ok) return false;

      const data = await res.json();
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Refresh token error:", err);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      const valid = await validateAccessToken(token);
      setAuthorized(valid);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return <LoadingScreen />;

  if (!authorized) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;