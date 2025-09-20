import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../../pages/LoadingScreen"; // Assuming you have a loading component

const API_URL = import.meta.env.VITE_API_URL;

const ProtectedStudioRoute = ({ children, allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  // Hits the /api/auth/admin/me endpoint
  const validateAccessToken = async (token) => {
    try {
      const res = await fetch(`${API_URL}/auth/studio/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        return data.user; // Returns the admin user object
      } else if (res.status === 401) {
        // Token expired, try to refresh
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          const newToken = localStorage.getItem("accessToken");
          return await validateAccessToken(newToken); // Retry validation with new token
        }
        return null;
      } else {
        return null;
      }
    } catch (err) {
      console.error("Admin auth validation error:", err);
      return null;
    }
  };

  // Hits the /api/auth/admin/refresh endpoint
  const refreshAccessToken = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/studio/refresh`, {
        method: "POST",
        credentials: "include", // Sends the httpOnly rt_admin cookie
      });

      if (!res.ok) return false;

      const data = await res.json();
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Admin refresh token error:", err);
      return false;
    }
  };

  useEffect(() => {
    const checkAdminAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      const user = await validateAccessToken(token);

      // **CRITICAL**: Check for a valid user AND if their role is allowed
      if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
        setAuthorized(false);
        setLoading(false);
        return;
      }
      
      // If checks pass, authorize and store admin data
      setAdminUser(user);
      setAuthorized(true);
      setLoading(false);
    };

    checkAdminAuth();
  }, [allowedRoles]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!authorized) {
    // If not authorized, clear any stale tokens and redirect to the ADMIN login page
    localStorage.removeItem("accessToken");
    return <Navigate to="/studio/login" replace />;
  }

  // If authorized, render the children components
  // Pass the adminUser object to the children if it's a function
  return typeof children === "function" ? children(adminUser) : children;
};

export default ProtectedStudioRoute;