// // import { useEffect, useState } from "react";
// // import { Navigate } from "react-router-dom";
// // import LoadingScreen from "./LoadingScreen";

// // const API_URL = import.meta.env.VITE_API_URL;

// // const ProtectedRoute = ({ children }) => {
// //   const [loading, setLoading] = useState(true);
// //   const [authorized, setAuthorized] = useState(false);
// //   const [userProfile, setUserProfile] = useState(null);

// //   // EDIT: refresh should return the *new token*, not just true/false
// //   const refreshAccessToken = async () => {
// //     try {
// //       const res = await fetch(`${API_URL}/auth/refresh`, {
// //         method: "POST",
// //         credentials: "include",
// //       });

// //       if (!res.ok) return null;

// //       const data = await res.json();
// //       if (data.accessToken) {
// //         localStorage.setItem("accessToken", data.accessToken);
// //         return data.accessToken; // ✅ return token
// //       }
// //       return null;
// //     } catch (err) {
// //       console.error("Refresh token error:", err);
// //       return null;
// //     }
// //   };

// //   // 🔹 EDIT: always return both user + token
// //   const validateAccessToken = async (token) => {
// //     try {
// //       const res = await fetch(`${API_URL}/auth/me`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       if (res.ok) {
// //         const data = await res.json();
// //         return { user: data.user, token };
// //       } else if (res.status === 401) {
// //         const newToken = await refreshAccessToken();
// //         if (newToken) {
// //           return await validateAccessToken(newToken); // retry with new token
// //         }
// //         return null;
// //       } else {
// //         return null;
// //       }
// //     } catch (err) {
// //       console.error("Auth validation error:", err);
// //       return null;
// //     }
// //   };

// //   const fetchUserProfile = async (token) => {
// //     try {
// //       const res = await fetch(`${API_URL}/user/profile`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       if (!res.ok) throw new Error("Profile fetch failed");
// //       return await res.json();
// //     } catch (err) {
// //       console.error("Fetch profile error:", err);
// //       return null;
// //     }
// //   };

// //   useEffect(() => {
// //     const checkAuth = async () => {
// //       let token = localStorage.getItem("accessToken");
// //       if (!token) {
// //         setAuthorized(false);
// //         setLoading(false);
// //         return;
// //       }

// //       // 🔹 EDIT: validateAccessToken now gives back fresh token too
// //       const validated = await validateAccessToken(token);
// //       if (!validated) {
// //         setAuthorized(false);
// //         setLoading(false);
// //         return;
// //       }

// //       const { user, token: freshToken } = validated;

// //       // 🔹 EDIT: fetch profile with *freshToken*
// //       const profile = await fetchUserProfile(freshToken);
// //       if (!profile) {
// //         setAuthorized(false);
// //         setLoading(false);
// //         return;
// //       }

// //       setUserProfile(profile);
// //       setAuthorized(true);
// //       setLoading(false);
// //     };

// //     checkAuth();
// //   }, []);

// //   if (loading) return <LoadingScreen />;

// //   if (!authorized) {
// //     localStorage.removeItem("accessToken");
// //     localStorage.removeItem("user");
// //     return <Navigate to="/login" replace />;
// //   }

// //   // Onboarding / Welcome Screen Logic
// //   if (
// //     !userProfile.onboarding_completed &&
// //     window.location.pathname !== "/welcome"
// //   ) {
// //     return <Navigate to="/welcome" replace />;
// //   }

// //   if (
// //     userProfile.onboarding_completed &&
// //     window.location.pathname === "/welcome"
// //   ) {
// //     return <Navigate to="/dashboard" replace />;
// //   }

// //   return typeof children === "function" ? children(userProfile) : children;
// // };

// // export default ProtectedRoute;

// import { useEffect, useState, lazy, Suspense } from "react";
// import { Navigate } from "react-router-dom";

// const API_URL = import.meta.env.VITE_API_URL;

// // Lazy load the loading screen
// const LoadingScreen = lazy(() => import("../../PublicPage/LoaderPage/PageLoader"));

// const ProtectedRoute = ({ children }) => {
//   const [loading, setLoading] = useState(true);
//   const [authorized, setAuthorized] = useState(false);
//   const [userProfile, setUserProfile] = useState(null);

//   const refreshAccessToken = async () => {
//     try {
//       const res = await fetch(`${API_URL}/auth/refresh`, {
//         method: "POST",
//         credentials: "include",
//       });
//       if (!res.ok) return null;
//       const data = await res.json();
//       if (data.accessToken) {
//         localStorage.setItem("accessToken", data.accessToken);
//         return data.accessToken;
//       }
//       return null;
//     } catch (err) {
//       console.error("Refresh token error:", err);
//       return null;
//     }
//   };

//   const validateAccessToken = async (token) => {
//     try {
//       const res = await fetch(`${API_URL}/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.ok) {
//         const data = await res.json();
//         return { user: data.user, token };
//       } else if (res.status === 401) {
//         const newToken = await refreshAccessToken();
//         if (newToken) return await validateAccessToken(newToken);
//         return null;
//       }
//       return null;
//     } catch (err) {
//       console.error("Auth validation error:", err);
//       return null;
//     }
//   };

//   const fetchUserProfile = async (token) => {
//     try {
//       const res = await fetch(`${API_URL}/user/profile`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Profile fetch failed");
//       return await res.json();
//     } catch (err) {
//       console.error("Fetch profile error:", err);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const checkAuth = async () => {
//       let token = localStorage.getItem("accessToken");
//       if (!token) {
//         setAuthorized(false);
//         setLoading(false);
//         return;
//       }

//       const validated = await validateAccessToken(token);
//       if (!validated) {
//         setAuthorized(false);
//         setLoading(false);
//         return;
//       }

//       const { user, token: freshToken } = validated;
//       const profile = await fetchUserProfile(freshToken);

//       if (!profile) {
//         setAuthorized(false);
//         setLoading(false);
//         return;
//       }

//       setUserProfile(profile);
//       setAuthorized(true);
//       setLoading(false);
//     };

//     checkAuth();
//   }, []);

//   if (loading) {
//     return (
//       <Suspense
//         fallback={
//           <div className="flex flex-col items-center justify-center h-screen">
//             <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//             <p className="text-gray-700 mt-4">Loading...</p>
//           </div>
//         }
//       >
//         <LoadingScreen />
//       </Suspense>
//     );
//   }

//   if (!authorized) {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("user");
//     return <Navigate to="/login" replace />;
//   }

//   if (
//     !userProfile.onboarding_completed &&
//     window.location.pathname !== "/welcome"
//   ) {
//     return <Navigate to="/welcome" replace />;
//   }

//   if (
//     userProfile.onboarding_completed &&
//     window.location.pathname === "/welcome"
//   ) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return typeof children === "function" ? children(userProfile) : children;
// };

// export default ProtectedRoute;

import { useEffect, useState } from "react"; // <-- 1. Removed lazy and Suspense
import { Navigate } from "react-router-dom";
import LoadingScreen from "../../PublicPage/LoaderPage/PageLoader"; // <-- 2. Changed to a normal import

const API_URL = import.meta.env.VITE_API_URL;

// <-- 3. Removed the lazy() version
// const LoadingScreen = lazy(() => import("../../PublicPage/LoaderPage/PageLoader"));

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const refreshAccessToken = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
      }
      return null;
    } catch (err) {
      console.error("Refresh token error:", err);
      return null;
    }
  };

  const validateAccessToken = async (token) => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        return { user: data.user, token };
      } else if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) return await validateAccessToken(newToken);
        return null;
      }
      return null;
    } catch (err) {
      console.error("Auth validation error:", err);
      return null;
    }
  };

  const fetchUserProfile = async (token) => {
    try {
      const res = await fetch(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Profile fetch failed");
      return await res.json();
    } catch (err) {
      console.error("Fetch profile error:", err);
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      let token = localStorage.getItem("accessToken");
      if (!token) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      const validated = await validateAccessToken(token);
      if (!validated) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      const { user, token: freshToken } = validated;
      const profile = await fetchUserProfile(freshToken);

      if (!profile) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      setUserProfile(profile);
      setAuthorized(true);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    // <-- 4. Simplified this block
    // Now it just renders your PageLoader instantly.
    return <LoadingScreen />;
  }

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