import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./pages/LearnerPage/ProtectedPage/ProtectedRoute";
import ThemedPageLoader from "./pages/PublicPage/LoaderPage/PageLoader";

// Lazy-loaded pages
const HomePage = lazy(() => import("./pages/PublicPage/HomePage/Homepage"));
const AboutPage = lazy(() => import("./pages/PublicPage/AboutPage/AboutPage"));
const LoginPage = lazy(() => import("./pages/LearnerPage/AuthPage/LoginPage"));
const ForgotPasswordPage = lazy(() =>
  import("./pages/LearnerPage/AuthPage/ForgotPasswordPage")
);
const SignUpPage = lazy(() =>
  import("./pages/LearnerPage/AuthPage/SignupPage")
);
const ResetPasswordPage = lazy(() =>
  import("./pages/LearnerPage/AuthPage/ResetPasswordPage")
);

const WelcomeScreen = lazy(() =>
  import("./pages/LearnerPage/ProtectedPage/WelcomePage/WelcomeScreen")
);
const DashboardLayout = lazy(() =>
  import("./pages/LearnerPage/ProtectedPage/Layouts/DashboardLayout")
);
const OverviewPage = lazy(() =>
  import("./pages/LearnerPage/ProtectedPage/Dashboard/Overview/OverviewPage")
);
const LearnPage = lazy(() =>
  import("./pages/LearnerPage/ProtectedPage/Dashboard/Learn/LearnPage")
);
const PracticePage = lazy(() =>
  import("./pages/LearnerPage/ProtectedPage/Dashboard/Practice/PracticePage")
);
const CommunitiesPage = lazy(() =>
  import(
    "./pages/LearnerPage/ProtectedPage/Dashboard/Communities/CommunitiesPage"
  )
);
const OpportunitiesPage = lazy(() =>
  import(
    "./pages/LearnerPage/ProtectedPage/Dashboard/Opportunities/OpportunitiesPage"
  )
);
const VideoPlayerPage = lazy(() =>
  import(
    "./pages/LearnerPage/ProtectedPage/Dashboard/Learn/archives/VideoPlayerPage"
  )
);
const LearningPathPage = lazy(() =>
  import(
    "./pages/LearnerPage/ProtectedPage/Dashboard/Learn/pages/LearningPathPage"
  )
);
const CoursePage = lazy(() =>
  import("./pages/LearnerPage/ProtectedPage/Dashboard/Learn/pages/CoursePage")
);
const LessonPage = lazy(() =>
  import("./pages/LearnerPage/ProtectedPage/Dashboard/Learn/pages/LessonsPage")
);
const ProjectSolver = lazy(() =>
  import(
    "./pages/LearnerPage/ProtectedPage/Dashboard/Practice/pages/ProjectSolver"
  )
);
const ProblemSolver = lazy(() =>
  import(
    "./pages/LearnerPage/ProtectedPage/Dashboard/Practice/pages/ProblemSolver"
  )
);
const TaskCalendar = lazy(() =>
  import(
    "./pages/LearnerPage/ProtectedPage/Dashboard/Overview/components/TaskCalendar"
  )
);
const NewsroomPage = lazy(() =>
  import(
    "./pages/LearnerPage/ProtectedPage/Dashboard/Learn/archives/NewsroomPage"
  )
);
const StudioLoginPage = lazy(() => import("./pages/StudioPage/StudioLogin"));
const ProfilePage = lazy(() =>
  import("./pages/LearnerPage/ProtectedPage/WelcomePage/ProfilePage")
);
const NotFoundPage = lazy(() => import("./pages/ErrorPages/NotFound"));
const PageUnderConstructionPage = lazy(() =>
  import("./pages/ErrorPages/PageUnderConstructionPage")
);

function App() {
  return (
    <Router>
      <Suspense fallback={<ThemedPageLoader />}>
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
                {(userProfile) => <DashboardLayout userProfile={userProfile} />}
              </ProtectedRoute>
            }
          >
            <Route index element={<OverviewPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="learn">
              <Route index element={<LearnPage />} />
              <Route path="paths/:pathSlug" element={<LearningPathPage />} />
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
      </Suspense>
    </Router>
  );
}

export default App;
