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
import DashboardLayout from "./pages/LearnerPage/ProtectedPage/Layouts/DashboardLayout";
import OverviewPage from "./pages/LearnerPage/ProtectedPage/Dashboard/Overview/OverviewPage";
import LearnPage from "./pages/LearnerPage/ProtectedPage/Dashboard/Learn/LearnPage";
import PracticePage from "./pages/LearnerPage/ProtectedPage/Dashboard/Practice/PracticePage";
import CommunitiesPage from "./pages/LearnerPage/ProtectedPage/Dashboard/Communities/CommunitiesPage";
import OpportunitiesPage from "./pages/LearnerPage/ProtectedPage/Dashboard/Opportunities/OpportunitiesPage";
import VideoPlayerPage from "./pages/LearnerPage/ProtectedPage/Dashboard/Learn/archives/VideoPlayerPage";
import LearningPathPage from "./pages/LearnerPage/ProtectedPage/Dashboard/Learn/pages/LearningPathPage";
import CoursePage from "./pages/LearnerPage/ProtectedPage/Dashboard/Learn/pages/CoursePage";
import LessonPage from "./pages/LearnerPage/ProtectedPage/Dashboard/Learn/pages/LessonsPage";
import ProjectSolver from "./pages/LearnerPage/ProtectedPage/Dashboard/Practice/pages/ProjectSolver";
import ProblemSolver from "./pages/LearnerPage/ProtectedPage/Dashboard/Practice/pages/ProblemSolver";
// import TaskItem from "./pages/LearnerPage/ProtectedPage/Dashboard/Overview/components/TaskItem";
import TaskCalendar from "./pages/LearnerPage/ProtectedPage/Dashboard/Overview/components/TaskCalendar";
import NewsroomPage from "./pages/LearnerPage/ProtectedPage/Dashboard/Learn/archives/NewsroomPage";
import StudioLoginPage from "./pages/StudioPage/StudioLogin";
import ProfilePage from "./pages/LearnerPage/ProtectedPage/WelcomePage/ProfilePage";

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
          path="/dashboard" // Use a cleaner base path
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="profile" element={<ProfilePage/>} />
          {/* Group all learning-related routes together */}
          <Route path="learn">
            <Route index element={<LearnPage />} />
            <Route path="paths/:pathSlug" element={<LearningPathPage />} />
            {/* <Route path="courses/:courseSlug" element={<CoursePage />} /> */}
            <Route
              path="paths/:pathSlug/courses/:courseSlug"
              element={<CoursePage />}
            />

            <Route
              path="paths/:pathSlug/courses/:courseSlug/lessons/:lessonId"
              element={<LessonPage />}
            />
          </Route>
          <Route path="calendar" element={<TaskCalendar />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="community" element={<CommunitiesPage />} />
          <Route path="jobs" element={<OpportunitiesPage />} />
          <Route path="projects/:projectSlug" element={<ProjectSolver />} />
          <Route path="problems/:problemSlug" element={<ProblemSolver />} />
        </Route>

        <Route path="/studio" element={<StudioLoginPage />} />

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
