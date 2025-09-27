import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/Home/HomePage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login/LoginPage";
import SignupPage from "./pages/Login/SignupPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import TestDashboard from "./pages/TestDashboard";
import WelcomeScreen from "./pages/Dashboard/WelcomeScreen";
import ForgotPasswordPage from "./pages/Login/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Login/ResetPasswordPage";
import ProtectedStudioRoute from "./components/auth/ProtectedStudioRoute";
import StudioLayout from "./pages/Studio/StudioLayout";
import StudioLoginPage from "./pages/Studio/StudioLogin";
import ResetPasswordStudioPage from "./pages/Studio/ResetPasswordStudioPage";
import ForgotPasswordStudioPage from "./pages/Studio/ForgotPasswordStudioPage";
import StudioDashboard from "./pages/Studio/Dashboard/StudioDashboard";
import StudioLessons from "./pages/Studio/Dashboard/Content/StudioLessons";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Home page */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<NotFound />} /> {/* 404 Page */}
        <Route path="/studio/login" element={<StudioLoginPage />} />
        <Route
          path="/studio/forgot-password"
          element={<ForgotPasswordStudioPage />}
        />
        <Route
          path="/studio/reset-password"
          element={<ResetPasswordStudioPage />}
        />
        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <WelcomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Protected Admin Routes */}
        {/* === The Protected Studio Layout Route === */}
        <Route
          path="/studio"
          element={
            <ProtectedStudioRoute
              allowedRoles={["Super Admin", "Content Creator", "Moderator"]}
            >
              <StudioLayout />
            </ProtectedStudioRoute>
          }
        >
          {/* Child routes will render inside StudioLayout's <Outlet /> */}
          <Route index element={<StudioDashboard />} />
          <Route path="dashboard" element={<StudioDashboard />} />
          <Route path="content/lessons" element={<StudioLessons />} />
          {/* Add all other studio pages here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
