import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/PublicPage/HomePage/Homepage";
import NotFoundPage from "./pages/ErrorPages/NotFound";
import AboutPage from "./pages/PublicPage/AboutPage/AboutPage";
import PageUnderConstructionPage from "./pages/ErrorPages/PageUnderConstructionPage";
import LoginPage from "./pages/LearnerPage/AuthPage/LoginPage";
import ForgotPasswordPage from "./pages/LearnerPage/AuthPage/ForgotPasswordPage";
import SignUpPage from "./pages/LearnerPage/AuthPage/SignupPage";
import ResetPasswordPage from "./pages/LearnerPage/AuthPage/ResetPasswordPage";

import ProtectedRoute from "./pages/LearnerPage/ProtectedPage/ProtectedRoute";
import WelcomeScreen from "./pages/LearnerPage/ProtectedPage/WelcomePage/WelcomeScreen";
import DashboardLayout from "./pages/LearnerPage/ProtectedPage/Dashboard/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Learner Auth Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Learner Protected Pages */}
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
              <DashboardLayout />
            </ProtectedRoute>
          }
        />

        {/* Error Pages */}
        <Route path="*" element={<NotFoundPage />} />
        <Route
          path="/under-construction"
          element={<PageUnderConstructionPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
