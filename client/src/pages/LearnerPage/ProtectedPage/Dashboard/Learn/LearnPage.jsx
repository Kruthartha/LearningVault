import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Compass,
  Layers,
  PlayCircle,
  Search,
  Flame,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";


const RecommendationCardSkeleton = () => (
  <div className="p-6 transition-all border rounded-2xl bg-white border-neutral-200/80 dark:bg-[#0e1013] dark:border-[#30363d]">
    <div className="h-3 w-1/4 mb-3 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
    <div className="h-5 w-3/4 mb-3 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
    <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
  </div>
);

const StreakTrackerSkeleton = () => (
  <div className="p-6 border rounded-2xl bg-white border-neutral-200/80 dark:bg-[#0e1013] dark:border-[#30363d]">
    <div className="h-6 w-1/3 mb-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="flex-1 space-y-2">
        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
    <div className="flex items-center justify-between mt-5">
      {Array(7)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"
          ></div>
        ))}
    </div>
  </div>
);

const LearnPageSkeleton = () => (
  <div className="text-neutral-800 dark:text-neutral-300">
    <div className="mx-auto max-w-7xl ">
      <header className="mb-12">
        <div className="h-12 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="mt-3 h-6 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </header>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        <main className="space-y-12 lg:col-span-2">
          <section>
            <div className="flex mb-6 h-10 border-b border-neutral-200 dark:border-gray-700">
              <div className="h-full w-28 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>

            <div className="p-8 border rounded-2xl bg-white dark:bg-[#0e1013] border-neutral-200/80 dark:border-[#30363d]">
              <div className="h-8 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="mt-2 mb-8 h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-2 w-full mb-6 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-12 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </section>

          <section>
            <div className="h-8 w-1/3 mb-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <RecommendationCardSkeleton />
              <RecommendationCardSkeleton />
            </div>
          </section>
        </main>

        <aside className="space-y-8 lg:sticky lg:top-24">
          <StreakTrackerSkeleton />
          <div className="p-6 border rounded-2xl bg-white dark:bg-[#0e1013] border-neutral-200/80 dark:border-[#30363d]">
            <div className="h-6 w-1/3 mb-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-2">
              <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
);

// --- Reusable UI Components (Themed) ---

const API_URL = import.meta.env.VITE_API_URL;

const ProgressBar = ({ progress }) => (
  // Updated: Dark mode background for the progress track
  <div className="w-full h-2 overflow-hidden rounded-full bg-neutral-200/70 dark:bg-gray-700">
    <div
      className="h-2 bg-blue-600 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${progress}%` }}
    />
  </div>
);

const RecommendationCard = ({ item }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/dashboard/learn/courses/${item.slug}`)}
      // Updated: Card styles for dark mode
      className="p-6 transition-all border rounded-2xl cursor-pointer bg-white  border-neutral-200/80 dark:bg-[#0e1013] dark:border-[#30363d] hover:border-neutral-300 dark:hover:border-gray-700 hover:shadow-sm"
    >
      {/* Updated: Text colors for dark mode */}
      <p className="mb-2 text-xs font-medium tracking-wider uppercase text-blue-600 dark:text-blue-400">
        {item.category}
      </p>
      <h4 className="mb-2 text-lg font-normal text-slate-800 dark:text-slate-200">
        {item.title}
      </h4>
      <p className="text-sm font-light text-slate-500 dark:text-slate-400">
        <Sparkles size={14} className="inline-block mr-1.5 text-yellow-500" />
        {item.reason}
      </p>
    </div>
  );
};

const StreakTracker = ({ streak }) => {
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const todayIndex = new Date().getDay();

  return (
    // Updated: Card styles for dark mode
    <div className="p-6 border rounded-2xl bg-white  border-neutral-200/80 dark:bg-[#0e1013] dark:border-[#30363d]">
      <h3 className="mb-4 font-normal text-neutral-800 dark:text-neutral-200">
        Weekly Streak
      </h3>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Flame size={40} className="text-orange-500" />
          {/* Updated: Border color to match dark card background */}
          <span className="absolute flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-orange-500 border-2 border-white rounded-full -top-1 -right-2 dark:border-[#161b22]">
            {streak.days}
          </span>
        </div>
        <div>
          <p className="text-lg font-medium text-slate-800 dark:text-slate-50">
            {streak.days}-Day Streak
          </p>
          <p className="text-sm font-light text-slate-500 dark:text-slate-400">
            Keep the flame alive!
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-5">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium ${
              streak.days > 0 &&
              index <= todayIndex &&
              streak.days > todayIndex - index
                ? // Updated: Active day styles for dark mode
                  "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
                : // Updated: Inactive day styles for dark mode
                  "bg-neutral-100 text-neutral-400 dark:bg-gray-800 dark:text-gray-500"
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function LearnPage() {
  const navigate = useNavigate();
  const [inProgress, setInProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [pathSlug, setPathSlug] = useState(null);
  const [streakData, setStreakData] = useState({ current_streak: 0 });

  const recommendations = [
    {
      id: 5,
      title: "State Management with Zustand",
      slug: "zustand-state-management",
      category: "Frontend",
      reason: "Because you are taking Advanced React",
    },
    {
      id: 6,
      title: "Introduction to TypeScript",
      slug: "intro-to-typescript",
      category: "Core Skills",
      reason: "A great next step for JS developers",
    },
  ];

  // --- Data fetching logic remains the same ---
  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("You are not logged in.");
        setIsLoading(false);
        return;
      }
      try {
        const [progressResponse, streakResponse] = await Promise.all([
          fetch(`${API_URL}/user/progress`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/user/streak`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!progressResponse.ok) {
          throw new Error(`HTTP error! status: ${progressResponse.status}`);
        }
        if (!streakResponse.ok) {
          throw new Error(`HTTP error! status: ${streakResponse.status}`);
        }

        const progressData = await progressResponse.json();
        const streakResult = await streakResponse.json();

        setStreakData(streakResult);

        const pathData = progressData[0];
        if (!pathData || !pathData.courses || pathData.courses.length === 0) {
          setInProgress([]);
          return;
        }

        setPathSlug(pathData.id);

        const pathProgress =
          pathData.courses.reduce((sum, course) => sum + course.progress, 0) /
          pathData.courses.length;
        const firstUnfinishedCourseForPath =
          pathData.courses.find((c) => c.progress < 100) || pathData.courses[0];
        const pathActionText =
          pathProgress > 0 ? "Continue with" : "Start with";
        const pathObject = {
          type: "path",
          id: pathData.id,
          title: pathData.title,
          slug: pathData.id,
          nextUp: `${pathActionText} ${
            firstUnfinishedCourseForPath?.title || "the first course"
          }`,
          progress: Math.round(pathProgress),
          icon: Layers,
        };

        const courseData =
          pathData.courses.find(
            (c) => c.status === "unlocked" && c.progress < 100
          ) || pathData.courses[0];
        const firstModule = courseData.modules?.[0];
        const firstLesson = firstModule?.lessons?.[0];
        const courseNextUp =
          firstLesson?.title || firstModule?.title || "Review course materials";
        const courseObject = {
          type: "course",
          id: courseData.id,
          title: courseData.title,
          slug: courseData.id,
          nextUp: courseNextUp,
          progress: Math.round(courseData.progress),
        };

        setInProgress([courseObject, pathObject]);
        setCurrentCourse(courseObject);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [navigate]);

if (isLoading) return <LearnPageSkeleton />; // <-- THIS IS THE CHANGE
  if (error)
    return (
            <div className="rounded-2xl border bg-red-50 p-8 text-center font-medium text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-200/80 dark:border-red-900/50">
              Error: {error}
            </div>
    );
  if (!currentCourse)
    return (
      <div className="p-10 text-center text-lg">
        No learning progress found. Start a new course!
      </div>
    );

  const activeItem = inProgress[activeTab];
  const hasStartedCourse = currentCourse && currentCourse.progress > 0;

  const handleNavigation = () => {
    if (activeItem.type === "path") {
      navigate(`/dashboard/learn/paths/${activeItem.slug}`);
    } else if (activeItem.type === "course" && pathSlug) {
      navigate(`/dashboard/learn/paths/${pathSlug}/courses/${activeItem.slug}`);
    }
  };

  return (
    // Updated: Base text color for dark mode
    <div className="text-neutral-800 dark:text-neutral-300">
      <div className="mx-auto max-w-7xl ">
        <header className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              {/* Updated: Header text colors for dark mode */}
              <h1 className="text-4xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 md:text-5xl">
                {hasStartedCourse
                  ? "Pick up where you left off"
                  : "Ready to get started?"}
              </h1>
              <p className="mt-2 text-lg font-light text-slate-500 dark:text-slate-400">
                {hasStartedCourse
                  ? `You're ${currentCourse.progress}% through ${currentCourse.title}. Keep going!`
                  : `Your journey begins with '${currentCourse.title}'. Let's dive in!`}
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          <main className="space-y-12 lg:col-span-2">
            <section>
              {/* Updated: Tab container border */}
              <div className="flex mb-6 border-b border-neutral-200 dark:border-gray-700">
                {inProgress.map((item, index) => {
                  const actionText = item.progress > 0 ? "Continue" : "Start";
                  const typeText = item.type === "course" ? "Course" : "Path";
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(index)}
                      // Updated: Tab styles for dark mode (active and inactive)
                      className={`px-4 py-3 text-sm transition-colors ${
                        activeTab === index
                          ? "border-b-2 font-medium border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                          : "font-light text-neutral-500 hover:text-neutral-800 dark:text-slate-400 dark:hover:text-slate-200"
                      }`}
                    >
                      {`${actionText} ${typeText}`}
                    </button>
                  );
                })}
              </div>

              {/* Updated: Main card styles for dark mode */}
              <div className="p-8 border rounded-2xl bg-white dark:bg-[#0e1013] border-neutral-200/80 dark:border-[#30363d]">
                <h3 className="mb-2 text-2xl font-medium text-neutral-900 dark:text-neutral-100">
                  {activeItem.title}
                </h3>
                <p className="mb-8 text-base font-light text-slate-500 dark:text-slate-400">
                  <span className="font-normal text-neutral-600 dark:text-neutral-300">
                    Next up:
                  </span>{" "}
                  {activeItem.nextUp}
                </p>
                <div className="flex items-center gap-4 mb-3">
                  <ProgressBar progress={activeItem.progress} />
                  <span className="text-sm font-normal whitespace-nowrap text-slate-600 dark:text-slate-400">
                    {activeItem.progress}%
                  </span>
                </div>
                <button
                  onClick={handleNavigation}
                  className="inline-flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-full shadow-sm hover:bg-blue-700"
                >
                  <PlayCircle size={20} />
                  {activeItem.type === "course"
                    ? activeItem.progress > 0
                      ? "Continue Lesson"
                      : "Start Lesson"
                    : activeItem.progress > 0
                    ? "Continue Path"
                    : "Start Path"}
                </button>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-normal tracking-tight text-slate-900 dark:text-slate-100">
                Recommended for You
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {recommendations.map((item) => (
                  <RecommendationCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          </main>

          <aside className="space-y-8 lg:sticky lg:top-24">
            <StreakTracker streak={{ days: streakData.current_streak }} />
            {/* Updated: Explore card styles */}
            <div className="p-6 border rounded-2xl bg-white dark:bg-[#0e1013] border-neutral-200/80 dark:border-[#30363d]">
              <h3 className="mb-4 font-normal text-slate-800 dark:text-slate-200">
                Explore
              </h3>
              <div className="space-y-2">
                {/* Updated: Button styles for dark mode */}
                <button
                  onClick={() => navigate("/dashboard/learn/courses")}
                  className="flex w-full items-center gap-3 p-3 text-left transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-slate-800"
                >
                  <BookOpen
                    size={20}
                    className="text-slate-500 dark:text-slate-400"
                  />
                  <span className="font-light">My Courses</span>
                </button>
                <button
                  onClick={() => navigate("/dashboard/learn/paths")}
                  className="flex w-full items-center gap-3 p-3 text-left transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-slate-800"
                >
                  <Compass
                    size={20}
                    className="text-slate-500 dark:text-slate-400"
                  />
                  <span className="font-light">All Learning Paths</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
