import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  PlayCircle,
  Lock,
  ChevronDown,
  Check,
  ListVideo,
  CheckCheck,
  LockKeyholeOpen,
  Info,
  CornerDownRight,
  Play,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

// --- 1. Skeleton Loader Components ---

const LessonItemSkeleton = () => (
  <div className="flex items-center gap-4 px-4 py-3">
    <div className="h-5 w-5 flex-shrink-0 rounded-full bg-neutral-200 dark:bg-gray-700"></div>
    <div className="h-5 flex-grow rounded bg-neutral-200 dark:bg-gray-700"></div>
    <div className="h-4 w-10 rounded bg-neutral-200 dark:bg-gray-700"></div>
  </div>
);

const ModuleAccordionSkeleton = ({ isOpen = false }) => (
  <div className="overflow-hidden rounded-xl border border-neutral-200/80 dark:border-[#30363d]">
    {/* Header part */}
    <div className="flex w-full items-center justify-between p-6 bg-white dark:bg-[#161b22]">
      <div className="flex flex-grow items-center gap-4">
        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-neutral-200 dark:bg-gray-700"></div>
        <div className="w-full space-y-2">
          <div className="h-6 w-1/2 rounded bg-neutral-200 dark:bg-gray-700"></div>
          <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-gray-700"></div>
        </div>
      </div>
      <div className="h-6 w-6 rounded bg-neutral-200 dark:bg-gray-700"></div>
    </div>
    {/* Open body part */}
    {isOpen && (
      <div className="border-t bg-white p-2 dark:bg-[#161b22] border-neutral-200/80 dark:border-[#30363d] divide-y divide-neutral-200/60 dark:divide-gray-800">
        <LessonItemSkeleton />
        <LessonItemSkeleton />
        <LessonItemSkeleton />
      </div>
    )}
  </div>
);

const CoursePageSkeleton = () => (
  <div className="min-h-screen animate-pulse bg-neutral-50 dark:bg-[#0d1117]">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Skeleton */}
      <header className="mb-12">
        <div className="mb-4 h-5 w-48 rounded bg-neutral-200 dark:bg-gray-700"></div>
        <div className="mb-3 h-12 w-3/4 rounded bg-neutral-200 dark:bg-gray-700"></div>
        <div className="h-6 w-full max-w-3xl rounded bg-neutral-200 dark:bg-gray-700"></div>
      </header>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3 lg:gap-12">
        <main className="space-y-12 lg:col-span-2">
          {/* "What you'll learn" Skeleton */}
          <section className="rounded-2xl border border-neutral-200/80 bg-white p-8 dark:border-[#30363d] dark:bg-[#161b22]">
            <div className="mb-6 h-8 w-1/2 rounded bg-neutral-200 dark:bg-gray-700"></div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 flex-shrink-0 rounded bg-neutral-200 dark:bg-gray-700"></div>
                <div className="h-5 w-full rounded bg-neutral-200 dark:bg-gray-700"></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 flex-shrink-0 rounded bg-neutral-200 dark:bg-gray-700"></div>
                <div className="h-5 w-5/6 rounded bg-neutral-200 dark:bg-gray-700"></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 flex-shrink-0 rounded bg-neutral-200 dark:bg-gray-700"></div>
                <div className="h-5 w-full rounded bg-neutral-200 dark:bg-gray-700"></div>
              </li>
            </ul>
          </section>

          {/* "Course Content" Skeleton */}
          <section>
            <div className="mb-4 h-8 w-1/3 rounded bg-neutral-200 dark:bg-gray-700"></div>
            <div className="space-y-4">
              <ModuleAccordionSkeleton isOpen={true} />
              <ModuleAccordionSkeleton />
              <ModuleAccordionSkeleton />
            </div>
          </section>
        </main>

        {/* Sidebar Skeleton */}
        <aside className="space-y-8 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-[#30363d] dark:bg-[#161b22]">
            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between">
                <div className="h-4 w-1/3 rounded bg-neutral-200 dark:bg-gray-700"></div>
                <div className="h-4 w-1/4 rounded bg-neutral-200 dark:bg-gray-700"></div>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-12 w-full rounded-xl bg-neutral-200 dark:bg-gray-700"></div>
          </div>
        </aside>
      </div>
    </div>
  </div>
);

// --- 2. ProgressBar Component (Themed) ---
const ProgressBar = ({ progress }) => {
  // ... (your existing component logic)
  const getColorClass = (p) => {
    if (p >= 95) return "bg-green-600";
    if (p >= 70) return "bg-green-500";
    if (p >= 50) return "bg-yellow-400";
    if (p >= 30) return "bg-orange-400";
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

// --- 3. LessonItem Component (Themed) ---
const LessonItem = ({ lesson, pathSlug, courseSlug, currentLessonId }) => {
  // ... (your existing component logic)
  const navigate = useNavigate();
  let displayStatus = lesson.status;
  if (lesson.id === currentLessonId && lesson.status !== "completed") {
    displayStatus = "in_progress";
  }
  const isLocked = displayStatus === "locked";

  const statusIcons = {
    in_progress: (
      <Play size={18} className="text-blue-500 dark:text-blue-400" />
    ),
    locked: (
      <Lock size={20} className="text-neutral-400 dark:text-neutral-500" />
    ),
    completed: (
      <Check size={20} className="text-green-500 dark:text-green-400" />
    ),
  };

  const handleLessonClick = () => {
    if (!isLocked) {
      navigate(
        `/dashboard/learn/paths/${pathSlug}/courses/${courseSlug}/lessons/${lesson.id}`
      );
    }
  };

  return (
    <div
      onClick={handleLessonClick}
      className={`flex items-center gap-4 px-4 py-3 ${
        isLocked
          ? "cursor-not-allowed"
          : "cursor-pointer rounded-lg hover:bg-neutral-50 dark:hover:bg-gray-800"
      }`}
    >
      <div className="flex-shrink-0">{statusIcons[displayStatus]}</div>
      <div className="flex-grow">
        <p
          className={`font-light ${
            isLocked
              ? "text-neutral-400 dark:text-neutral-500"
              : "text-neutral-800 dark:text-neutral-200"
          }`}
        >
          {lesson.title}
        </p>
      </div>
      <span
        className={`text-xs font-light ${
          isLocked
            ? "text-neutral-400 dark:text-neutral-500"
            : "text-neutral-500 dark:text-neutral-400"
        }`}
      >
        {/* Duration */}
      </span>
    </div>
  );
};

// --- 4. ModuleAccordion Component (Themed) ---
const ModuleAccordion = ({
  module,
  isOpen,
  onToggle,
  pathSlug,
  courseSlug,
}) => {
  // ... (your existing component logic)
  const statusIcons = {
    in_progress: (
      <ListVideo size={20} className="text-blue-500 dark:text-blue-400" />
    ),
    locked: (
      <Lock size={20} className="text-neutral-400 dark:text-neutral-500" />
    ),
    completed: (
      <CheckCheck size={20} className="text-green-600 dark:text-green-400" />
    ),
    unlocked: (
      <LockKeyholeOpen size={20} className="text-blue-500 dark:text-blue-400" />
    ),
  };

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200/80 dark:border-[#30363d]">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-6 text-left transition bg-white hover:bg-neutral-50/50 dark:bg-[#161b22] dark:hover:bg-gray-800"
      >
        <div className="flex items-center gap-4">
          {module.status && (
            <div className="flex-shrink-0">{statusIcons[module.status]}</div>
          )}
          <div>
            <h3 className="text-lg font-normal text-neutral-800 dark:text-neutral-200">
              {module.title}
            </h3>
            <p className="mt-1 text-sm font-light text-neutral-500 dark:text-neutral-400">
              {module.description ||
                "A summary of this module will be available soon."}
            </p>
          </div>
        </div>
        <ChevronDown
          size={24}
          className={`text-neutral-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="border-t bg-white p-2 dark:bg-[#161b22] border-neutral-200/80 dark:border-[#30363d] divide-y divide-neutral-200/60 dark:divide-gray-800">
          {module.lessons.map((lesson) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              pathSlug={pathSlug}
              courseSlug={courseSlug}
              currentLessonId={module.current_lesson_id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Page Component (Themed) ---
export default function CoursePage() {
  const navigate = useNavigate();
  const { pathSlug, courseSlug } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModuleId, setOpenModuleId] = useState(null);
  const [isVisible, setIsVisible] = useState(false); // For fade-in

  useEffect(() => {
    const fetchCourseData = async () => {
      setIsLoading(true); // Set loading true on each fetch
      setIsVisible(false); // Reset visibility
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Authentication required.");
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `${API_URL}/user/progress/${pathSlug}/${courseSlug}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        setCourseData(data.course);

        if (data.course?.modules) {
          const inProgressModule = data.course.modules.find(
            (m) => m.status === "in_progress"
          );
          if (inProgressModule) {
            setOpenModuleId(inProgressModule.id);
          } else {
            const firstModule = data.course.modules[0];
            if (firstModule) {
              setOpenModuleId(firstModule.id);
            }
          }
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseData();
  }, [pathSlug, courseSlug]);

  // Effect for fade-in animation
  useEffect(() => {
    if (!isLoading) {
      setIsVisible(true);
    }
  }, [isLoading]);

  const handleToggleModule = (moduleId) =>
    setOpenModuleId(openModuleId === moduleId ? null : moduleId);

  const handleContinueCourse = () => {
    // ... (your existing function logic)
    if (courseData?.modules) {
      const currentModule = courseData.modules.find(
        (m) => m.status === "in_progress"
      );
      if (currentModule && currentModule.current_lesson_id) {
        navigate(
          `/dashboard/learn/paths/${pathSlug}/courses/${courseSlug}/lessons/${currentModule.current_lesson_id}`
        );
        return;
      }

      for (const module of courseData.modules) {
        const nextLesson = module.lessons.find(
          (l) => l.status !== "completed" && l.status !== "locked"
        );
        if (nextLesson) {
          navigate(
            `/dashboard/learn/paths/${pathSlug}/courses/${courseSlug}/lessons/${nextLesson.id}`
          );
          return;
        }
      }
    }
    // Fallback action if the course is completed
    alert("You have completed this course!");
  };

  // 1. Render Skeleton
  if (isLoading) return <CoursePageSkeleton />;

  // 2. Render Error (with fade-in)
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

  // 3. Render No Data (with fade-in)
  if (!courseData)
    return (
      <div
        className={`p-12 text-center transition-opacity duration-500 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        No course data found.
      </div>
    );

  const learningObjectives = courseData.learningObjectives || [
    "Key learning objectives for this course will be listed here soon.",
  ];

  // 4. Render Main Content (with fade-in)
  return (
    <div
      className={`min-h-screen bg-neutral-50 text-neutral-800 dark:bg-[#0d1117] dark:text-neutral-300 transition-opacity duration-500 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12">
          <button
            onClick={() => navigate(`/dashboard/learn/paths/${pathSlug}`)}
            className="mb-4 flex items-center gap-2 text-sm font-light text-neutral-500 transition-colors hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
          >
            <ChevronLeft size={16} />
            Back to Learning Path
          </button>
          <h1 className="text-4xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 md:text-5xl">
            {courseData.title}
          </h1>
          <p className="mt-2 max-w-3xl text-lg font-light text-neutral-500 dark:text-neutral-400">
            {courseData.description ||
              "A summary for this course will be available soon."}
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3 lg:gap-12">
          <main className="space-y-12 lg:col-span-2">
            <section className="rounded-2xl border border-neutral-200/80 bg-white p-8 dark:border-[#30363d] dark:bg-[#161b22]">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-normal tracking-tight text-neutral-900 dark:text-neutral-100">
                <Info className="text-blue-600 dark:text-blue-400" size={24} />
                What you'll learn
              </h2>
              <ul className="space-y-3">
                {learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CornerDownRight
                      size={20}
                      className="mt-0.5 flex-shrink-0 text-green-600 dark:text-green-500"
                    />
                    <span className="font-light">{objective}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-normal tracking-tight text-neutral-900 dark:text-neutral-100">
                Course Content
              </h2>
              <div className="space-y-4">
                {courseData.modules.map((module) => (
                  <ModuleAccordion
                    key={module.id}
                    module={module}
                    isOpen={openModuleId === module.id}
                    onToggle={() => handleToggleModule(module.id)}
                    pathSlug={pathSlug}
                    courseSlug={courseSlug}
                  />
                ))}
              </div>
            </section>
          </main>

          <aside className="space-y-8 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-[#30363d] dark:bg-[#161b22]">
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-light text-neutral-600 dark:text-neutral-400">
                    Your Progress
                  </p>
                  <span className="text-sm font-normal text-neutral-600 dark:text-neutral-300">
                    {courseData.progress}%
                  </span>
                </div>
                <ProgressBar progress={courseData.progress} />
              </div>
              <button
                onClick={handleContinueCourse}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                <PlayCircle size={20} />
                Continue Course
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
