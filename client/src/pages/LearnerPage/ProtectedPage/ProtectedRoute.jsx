import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../../PublicPage/LoaderPage/PageLoader";
import api from "../../../services/api";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      return res.data;
    } catch (err) {
      console.error("Fetch profile error:", err);
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          setAuthorized(false);
          setLoading(false);
          return;
        }

        // Validate token (Axios wrapper auto-refreshes if expired)
        const { data } = await api.get("/auth/me");
        if (!data?.user) throw new Error("Invalid session");

        // Fetch profile (still using Axios wrapper)
        const profile = await fetchUserProfile();

        if (!profile) throw new Error("Profile fetch failed");

        setUserProfile(profile);
        setAuthorized(true);
      } catch (err) {
        console.error("Auth check failed:", err);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // --- UI Logic ---
  if (loading) return <LoadingScreen />;

  if (!authorized) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  if (
    !userProfile.onboarding_completed &&
    window.location.pathname !== "/welcome"
  ) {
    return <Navigate to="/welcome" replace />;
  }

  if (
    userProfile.onboarding_completed &&
    window.location.pathname === "/welcome"
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return typeof children === "function" ? children(userProfile) : children;
};

export default ProtectedRoute;