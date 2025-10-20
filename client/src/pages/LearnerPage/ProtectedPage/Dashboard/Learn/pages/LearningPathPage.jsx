import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  PlayCircle,
  Lock,
  CheckCircle,
  Target,
} from "lucide-react";

// --- Reusable UI Component (Themed) ---
const API_URL = import.meta.env.VITE_API_URL;

const ProgressBar = ({ progress }) => {
  const getColorClass = (p) => {
    // ... (your existing color logic)
    if (p >= 95) return "bg-green-600";
    if (p >= 80) return "bg-green-500";
    if (p >= 70) return "bg-lime-400";
    if (p >= 60) return "bg-yellow-400";
    if (p >= 50) return "bg-yellow-300";
    if (p >= 40) return "bg-amber-400";
    if (p >= 30) return "bg-orange-400";
    if (p >= 20) return "bg-orange-500";
    return "bg-red-500";
  };
  const colorClass = getColorClass(progress);
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200/70 dark:bg-gray-700">
      <div
        className={`h-2 rounded-full transition-all duration-500 ease-out ${colorClass}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// --- Timeline Step Component (Themed) ---

const TimelineStep = ({ course, index, isLast, pathSlug }) => {
  // ... (your existing component logic)
  const navigate = useNavigate();
  const isLocked = course.status === "locked";
  const isCompleted = course.progress === 100;
  const hasStarted = course.progress > 0 && !isCompleted;

  let buttonText = "Start Course";
  let buttonIcon = <PlayCircle size={20} />;
  let buttonClass = "bg-blue-600 text-white shadow-sm hover:bg-blue-700";

  if (isLocked) {
    buttonText = "Locked";
    buttonIcon = <Lock size={20} />;
    buttonClass =
      "bg-neutral-200 text-neutral-500 cursor-not-allowed dark:bg-gray-800 dark:text-neutral-500";
  } else if (isCompleted) {
    buttonText = "Review Course";
    buttonIcon = <CheckCircle size={20} />;
    buttonClass =
      "bg-white text-blue-600 border border-neutral-300 hover:bg-neutral-50 dark:bg-transparent dark:text-blue-400 dark:border-gray-600 dark:hover:bg-gray-800";
  } else if (hasStarted) {
    buttonText = "Continue Course";
  }

  const handleNavigation = () => {
    if (!isLocked) {
      navigate(`/dashboard/learn/paths/${pathSlug}/courses/${course.id}`);
    }
  };

  const stepNumber = String(index + 1).padStart(2, "0");

  return (
    <div className="flex gap-6 md:gap-8">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 ${
            isLocked
              ? "border-neutral-300 bg-neutral-100 dark:border-gray-600 dark:bg-gray-800"
              : "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-500/10"
          }`}
        >
          <span
            className={`text-base font-bold ${
              isLocked
                ? "text-neutral-400 dark:text-neutral-500"
                : "text-blue-600 dark:text-blue-400"
            }`}
          >
            {stepNumber}
          </span>
        </div>
        {!isLast && (
          <div className="my-2 w-0.5 flex-grow bg-neutral-200 dark:bg-gray-700"></div>
        )}
      </div>
      <div className="grid w-full grid-cols-1 gap-6 pt-1 lg:grid-cols-2">
        <div
          className={`flex h-full flex-col rounded-xl border bg-white p-6 dark:bg-[#161b22] border-neutral-200/80 dark:border-[#30363d] ${
            isLocked ? "opacity-60" : ""
          }`}
        >
          <h3 className="mb-3 text-xl font-normal text-neutral-800 dark:text-neutral-200">
            {course.title}
          </h3>
          <div className="flex-grow"></div>
          <div className="mb-5 flex items-center gap-3">
            <ProgressBar progress={course.progress} />
            <span className="w-12 text-right text-sm font-light text-neutral-500 dark:text-neutral-400">
              {course.progress}%
            </span>
          </div>
          <button
            onClick={handleNavigation}
            disabled={isLocked}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium transition-colors ${buttonClass}`}
          >
            {buttonIcon}
            <span>{buttonText}</span>
          </button>
        </div>
        <div
          className={`rounded-xl border bg-white p-6 dark:bg-[#161b22] border-neutral-200/80 dark:border-[#30363d] ${
            isLocked ? "opacity-60" : ""
          }`}
        >
          <h4 className="mb-3 flex items-center gap-2 text-lg font-normal text-neutral-800 dark:text-neutral-200">
            <Target
              size={20}
              className="text-neutral-500 dark:text-neutral-400"
            />
            <span>What you'll learn</span>
          </h4>
          <p className="mb-4 text-sm font-light text-neutral-600 dark:text-neutral-300">
            {course.description}
          </p>
          {course.skills && course.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {course.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:bg-gray-800 dark:text-neutral-400"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Skeleton Loader Components ---

const TimelineStepSkeleton = ({ isLast = false }) => (
  <div className="flex animate-pulse gap-6 md:gap-8">
    {/* Timeline Column */}
    <div className="flex flex-col items-center">
      <div className="h-12 w-12 flex-shrink-0 rounded-full bg-neutral-200 dark:bg-gray-700"></div>
      {!isLast && (
        <div className="my-2 w-0.5 flex-grow bg-neutral-200 dark:bg-gray-700"></div>
      )}
    </div>
    {/* Content Column */}
    <div className="grid w-full grid-cols-1 gap-6 pt-1 lg:grid-cols-2">
      {/* Card 1: Main Course */}
      <div className="flex h-full flex-col rounded-xl border border-neutral-200/80 bg-white p-6 dark:border-[#30363d] dark:bg-[#161b22]">
        <div className="mb-5 h-7 w-3/4 rounded bg-neutral-200 dark:bg-gray-700"></div>
        <div className="flex-grow"></div>
        <div className="mb-5 flex items-center gap-3">
          <div className="h-2 w-full rounded-full bg-neutral-200 dark:bg-gray-700"></div>
          <div className="h-4 w-12 rounded bg-neutral-200 dark:bg-gray-700"></div>
        </div>
        <div className="h-12 w-full rounded-xl bg-neutral-200 dark:bg-gray-700"></div>
      </div>
      {/* Card 2: Description */}
      <div className="rounded-xl border border-neutral-200/80 bg-white p-6 dark:border-[#30363d] dark:bg-[#161b22]">
        <div className="mb-4 h-6 w-1/2 rounded bg-neutral-200 dark:bg-gray-700"></div>
        <div className="mb-2 h-4 w-full rounded bg-neutral-200 dark:bg-gray-700"></div>
        <div className="mb-2 h-4 w-full rounded bg-neutral-200 dark:bg-gray-700"></div>
        <div className="mb-4 h-4 w-5/6 rounded bg-neutral-200 dark:bg-gray-700"></div>
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-20 rounded-full bg-neutral-200 dark:bg-gray-700"></div>
          <div className="h-6 w-24 rounded-full bg-neutral-200 dark:bg-gray-700"></div>
          <div className="h-6 w-16 rounded-full bg-neutral-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  </div>
);

const LearningPathPageSkeleton = () => (
  <div className="min-h-screen bg-neutral-50 dark:bg-[#0d1117]">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Button Skeleton */}
      <div className="mb-6 h-5 w-40 animate-pulse rounded bg-neutral-200 dark:bg-gray-700"></div>
      {/* Header Skeleton */}
      <header className="mb-16 animate-pulse rounded-2xl border border-neutral-200/80 bg-white p-8 dark:border-[#30363d] dark:bg-[#161b22]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex-grow">
            <div className="mb-3 h-4 w-1/4 rounded bg-neutral-200 dark:bg-gray-700"></div>
            <div className="mb-5 h-12 w-3/4 rounded bg-neutral-200 dark:bg-gray-700"></div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-full rounded-full bg-neutral-200 dark:bg-gray-700"></div>
              <div className="h-4 w-1/3 rounded bg-neutral-200 dark:bg-gray-700"></div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="h-12 w-full rounded-xl bg-neutral-200 dark:bg-gray-700 md:w-48"></div>
          </div>
        </div>
      </header>
      {/* Main Content Skeleton */}
      <main className="flex flex-col gap-10">
        <TimelineStepSkeleton />
        <TimelineStepSkeleton />
        <TimelineStepSkeleton isLast={true} />
      </main>
    </div>
  </div>
);

// --- Main Page Component ---

export default function LearningPathPage() {
  const navigate = useNavigate();
  const { pathSlug } = useParams();
  const [pathData, setPathData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false); // For fade-in

  useEffect(() => {
    const fetchPathData = async () => {
      // Reset visibility on new load
      setIsLoading(true);
      setIsVisible(false);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Authentication required. Please log in.");
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/user/progress/${pathSlug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok)
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        const data = await response.json();
        setPathData(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPathData();
  }, [pathSlug]);

  // Effect for fade-in animation
  useEffect(() => {
    if (!isLoading) {
      setIsVisible(true);
    }
  }, [isLoading]);

  const handleContinuePath = () => {
    if (!pathData?.courses) return;
    const nextCourse = pathData.courses.find(
      (course) => course.status !== "locked" && course.progress < 100
    );
    if (nextCourse) {
      navigate(`/dashboard/learn/paths/${pathSlug}/courses/${nextCourse.id}`);
    } else {
      alert("You've completed this path! 🎉");
    }
  };

  // Render Skeleton Loader
  if (isLoading) return <LearningPathPageSkeleton />;

  // Render Error State (with fade-in)
  if (error)
    return (
      <div
        className={`p-12 text-center text-red-500 transition-opacity duration-500 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        Error: {error}
      </div>
    );

  // Render No Data State (with fade-in)
  if (!pathData)
    return (
      <div
        className={`p-12 text-center transition-opacity duration-500 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        No data found for this learning path.
      </div>
    );

  const totalCourses = pathData.courses?.length || 0;
  const completedCourses =
    pathData.courses?.filter((c) => c.progress === 100).length || 0;
  const overallProgress = pathData.progress || 0;

  // Render Main Content (with fade-in)
  return (
    <div
      className={`min-h-screen bg-neutral-50 text-neutral-800 dark:bg-[#0d1117] dark:text-neutral-300 transition-opacity duration-500 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/dashboard/learn")}
          className="mb-6 flex items-center gap-2 text-sm font-light text-neutral-500 transition-colors hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
        >
          <ChevronLeft size={16} />
          Back to My Learning
        </button>
        <header className="mb-16 rounded-2xl border bg-white p-8 dark:bg-[#161b22] border-neutral-200/80 dark:border-[#30363d]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex-grow">
              <p className="mb-2 text-sm font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Learning Path
              </p>
              <h1 className="mb-4 text-4xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 md:text-5xl">
                {pathData.title}
              </h1>
              <div className="flex items-center gap-4">
                <ProgressBar progress={overallProgress} />
                <span className="whitespace-nowrap text-sm font-normal text-neutral-600 dark:text-neutral-300">
                  {completedCourses} of {totalCourses} courses completed
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={handleContinuePath}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-medium text-white shadow-sm transition-colors hover:bg-blue-700 md:w-auto"
              >
                <PlayCircle size={20} />
                <span>Continue Path</span>
              </button>
            </div>
          </div>
        </header>
        <main className="flex flex-col gap-10">
          {pathData.courses?.map((course, index) => (
            <TimelineStep
              key={course.id}
              course={course}
              index={index}
              isLast={index === totalCourses - 1}
              pathSlug={pathSlug}
            />
          ))}
        </main>
      </div>
    </div>
  );
}
