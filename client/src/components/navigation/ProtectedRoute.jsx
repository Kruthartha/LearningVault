import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../../pages/LoadingScreen";

const API_URL = import.meta.env.VITE_API_URL;

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const validateAccessToken = async (token) => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        return data.user;
      } else if (res.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          const newToken = localStorage.getItem("accessToken");
          return await validateAccessToken(newToken); // retry
        }
        return null;
      } else {
        return null;
      }
    } catch (err) {
      console.error("Auth validation error:", err);
      return null;
    }
  };

  const refreshAccessToken = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
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

  const fetchUserProfile = async (token) => {
    try {
      const res = await fetch(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Fetch profile error:", err);
      return null;
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

      const user = await validateAccessToken(token);
      if (!user) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      const profile = await fetchUserProfile(token);
      setUserProfile(profile);
      setAuthorized(true);
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

  // Onboarding / Welcome Screen Logic
  if (!userProfile.onboarding_completed && window.location.pathname !== "/welcome") {
    return <Navigate to="/welcome" replace />;
  }

  if (userProfile.onboarding_completed && window.location.pathname === "/welcome") {
    return <Navigate to="/dashboard" replace />;
  }

  return typeof children === "function" ? children(userProfile) : children;
};

export default ProtectedRoute;