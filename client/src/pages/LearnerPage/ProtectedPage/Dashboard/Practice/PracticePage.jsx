import React, { useState, useEffect } from "react"; // Imported useEffect
import { useNavigate } from "react-router-dom";
import {
  Code,
  Trophy,
  BookOpen,
  Filter,
  ArrowRight,
  Star,
  CheckCircle,
  Clock,
  Users,
  Target,
  Flame,
  BarChart3,
  Zap,
} from "lucide-react";

// --- Reusable UI Components (Themed) ---

const StatCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 rounded-2xl border bg-white p-4 dark:bg-[#161b22] border-neutral-200/80 dark:border-[#30363d]">
    <div className="rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
      {icon}
    </div>
    <div>
      <p className="text-xl font-medium text-neutral-800 dark:text-neutral-200">
        {value}
      </p>
      <p className="text-xs font-light text-neutral-500 dark:text-neutral-400">
        {label}
      </p>
    </div>
  </div>
);

const ProblemListItem = ({ problem }) => {
  const navigate = useNavigate();
  const handleProblemClick = () =>
    navigate(`/dashboard/problems/${problem.slug}`);

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-500/10";
      case "Medium":
        return "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-500/10";
      case "Hard":
        return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10";
      default:
        return "text-neutral-600 bg-neutral-100 dark:text-neutral-400 dark:bg-neutral-500/10";
    }
  };

  const StatusIcon = ({ status }) => {
    // Note: The API sends "Ready". This switch handles "solved" and "attempted".
    // "Ready" will fall into the 'default' case, showing the empty circle,
    // which is the correct behavior for an unsolved problem.
    switch (status) {
      case "solved": // You'll need to update your API or logic to set this
        return (
          <CheckCircle
            size={20}
            className="text-green-500 dark:text-green-400"
          />
        );
      case "attempted": // You'll need to update your API or logic to set this
        return (
          <Clock size={20} className="text-orange-500 dark:text-orange-400" />
        );
      default:
        return (
          <div className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-neutral-300 dark:border-gray-600" />
        );
    }
  };

  return (
    <div
      onClick={handleProblemClick}
      className="cursor-pointer rounded-2xl border bg-white p-5 transition-all hover:border-neutral-300 hover:shadow-sm dark:bg-[#161b22] border-neutral-200/80 dark:border-[#30363d] dark:hover:border-gray-700"
    >
      <div className="flex items-start gap-4">
        <StatusIcon status={problem.status} />
        <div className="flex-grow">
          <div className="mb-2 flex items-center gap-2">
            {/* API title doesn't include number, so we add it from the ID */}
            <p className="font-medium text-neutral-800 dark:text-neutral-200">
              {problem.id}. {problem.title}
            </p>
            {problem.premium && (
              <Star size={14} className="fill-current text-yellow-500" />
            )}
          </div>
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
            <span
              className={`rounded px-2 py-0.5 font-medium ${getDifficultyClass(
                problem.difficulty
              )}`}
            >
              {problem.difficulty}
            </span>
            <div className="h-3 w-px bg-neutral-200 dark:bg-gray-700" />
            {problem.tags.slice(0, 2).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
            <div className="h-3 w-px bg-neutral-200 dark:bg-gray-700" />
            <span>
              Acceptance:{" "}
              {/* API sends acceptance as a string, e.g., "49.20" */}
              <span className="font-medium text-neutral-600 dark:text-neutral-300">
                {problem.acceptance}%
              </span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Frequency:
              </p>
              <div className="h-1.5 w-24 rounded-full bg-neutral-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${problem.frequency}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                {problem.frequency}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Companies:
              </p>
              <div className="flex items-center gap-1">
                {problem.companies.slice(0, 2).map((c) => (
                  <span
                    key={c}
                    className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-gray-800 dark:text-neutral-400"
                  >
                    {c}
                  </span>
                ))}
                {problem.companies.length > 2 && (
                  <span className="text-xs text-neutral-500">
                    +{problem.companies.length - 2}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Practice Page Component ---

const Practice = () => {
  const [selectedTab, setSelectedTab] = useState("problems");

  // --- State for API Data ---
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stats (can remain hard-coded or be fetched from another API)
  const stats = {
    problemsSolved: 347,
    acceptanceRate: "78.2%",
    globalRank: "#142",
    contestRating: 1847,
    currentStreak: "23 days",
  };

  // --- The old hard-coded 'problems' array is now removed ---

  // --- Fetch Data from API on Component Mount ---
  useEffect(() => {
    const fetchProblems = async () => {
            const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("You are not logged in.");
        setIsLoading(false);
        return;
      }
      try {
        // --- IMPORTANT: Get token from your auth system ---
        // This example assumes it's in localStorage.
        // Update this line if you use Context, Redux, etc.
        // const token = localStorage.getItem("jwtToken");

        if (!token) {
          throw new Error("Authentication token not found. Please log in.");
        }

        const response = await fetch("http://localhost:3000/api/problems/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send the JWT token
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check if the API response structure matches the example
        if (data.ok && Array.isArray(data.problems)) {
          setProblems(data.problems); // Set state with the fetched problems
        } else {
          throw new Error(
            "API response was successful but data is not in the expected format."
          );
        }
      } catch (e) {
        console.error("Failed to fetch problems:", e);
        setError(e.message); // Set error state to display to the user
      } finally {
        setIsLoading(false); // Stop loading, whether successful or not
      }
    };

    fetchProblems();
  }, []); // Empty dependency array [] means this runs once when the component mounts

  // --- Other hard-coded data (can be moved to API calls later) ---
  const recentSubmissions = [
    { id: 1, problem: "Two Sum", status: "Accepted", time: "2h ago" },
    {
      id: 2,
      problem: "Valid Parentheses",
      status: "Wrong Answer",
      time: "4h ago",
    },
  ];
  const achievements = [
    { icon: "🏆", title: "Century Solver", desc: "Solved 100+ problems" },
    { icon: "🔥", title: "Streak Master", desc: "20-day solving streak" },
  ];

  // --- This function now renders based on API state ---
  const renderContent = () => {
    switch (selectedTab) {
      case "problems":
        // 1. Show loading state
        if (isLoading) {
          return (
            <div className="rounded-2xl border bg-white p-8 text-center font-light dark:bg-[#161b22] border-neutral-200/80 dark:border-[#30363d]">
              Loading problems...
            </div>
          );
        }

        // 2. Show error state
        if (error) {
          return (
            <div className="rounded-2xl border bg-red-50 p-8 text-center font-medium text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-200/80 dark:border-red-900/50">
              Error: {error}
            </div>
          );
        }

        // 3. Show problem list
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl border p-4 border-neutral-200/80 dark:border-[#30363d]">
              <Filter
                size={16}
                className="text-neutral-500 dark:text-neutral-400"
              />
              <span className="text-sm font-light text-neutral-600 dark:text-neutral-300">
                Filters:
              </span>
              <button className="rounded-full border bg-white px-3 py-1 text-sm font-normal transition hover:border-neutral-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500">
                Difficulty
              </button>
              <button className="rounded-full border bg-white px-3 py-1 text-sm font-normal transition hover:border-neutral-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500">
                Tags
              </button>
            </div>
            <div className="space-y-3">
              {/* This now maps over the 'problems' state variable from the API */}
              {problems.map((p) => (
                <ProblemListItem key={p.id} problem={p} />
              ))}
            </div>
          </div>
        );
      case "contests":
        return (
          <div className="rounded-2xl border bg-white p-8 text-center font-light dark:bg-[#161b22] border-neutral-200/80 dark:border-[#30363d]">
            Contests coming soon!
          </div>
        );
      case "study-plans":
        return (
          <div className="rounded-2xl border bg-white p-8 text-center font-light dark:bg-[#161b22] border-neutral-200/80 dark:border-[#30363d]">
            Study Plans coming soon!
          </div>
        );
      default:
        return null;
    }
  };

  // --- The rest of your component's JSX (unchanged) ---
  return (
    <div className="text-neutral-800 dark:text-neutral-300">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 md:text-5xl">
            Problem Solving
          </h1>
          <p className="mt-2 text-lg font-light text-neutral-500 dark:text-neutral-400">
            Challenge yourself, solve problems, and prepare for interviews.
          </p>
        </header>
        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <StatCard
            icon={<CheckCircle size={20} />}
            label="Problems Solved"
            value={stats.problemsSolved}
          />
          <StatCard
            icon={<Target size={20} />}
            label="Acceptance Rate"
            value={stats.acceptanceRate}
          />
          <StatCard
            icon={<Trophy size={20} />}
            label="Contest Rating"
            value={stats.contestRating}
          />
          <StatCard
            icon={<Users size={20} />}
            label="Global Rank"
            value={stats.globalRank}
          />
          <StatCard
            icon={<Flame size={20} />}
            label="Current Streak"
            value={stats.currentStreak}
          />
        </div>
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-3">
          <main className="space-y-8 lg:col-span-2">
            <div className="flex border-b border-neutral-200 dark:border-gray-700">
              {[
                { id: "problems", label: "All Problems", icon: Code },
                { id: "contests", label: "Contests", icon: Trophy },
                { id: "study-plans", label: "Study Plans", icon: BookOpen },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
                    selectedTab === tab.id
                      ? "border-b-2 font-medium border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                      : "font-light text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
            {renderContent()}
          </main>
          <aside className="space-y-8 lg:sticky lg:top-24">
            <div className="rounded-2xl border p-6 border-blue-300 dark:border-blue-900/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:bg-gradient-to-br dark:from-blue-950/20 dark:to-indigo-950/20">
              <h3 className="mb-4 font-normal text-blue-800 dark:text-blue-300">
                Today's Challenge
              </h3>
              <p className="mb-1 text-lg font-medium text-blue-900 dark:text-blue-200">
                Valid Palindrome II
              </p>
              <p className="mb-4 text-sm font-light text-blue-700 dark:text-blue-400">
                Category: String, Two Pointers
              </p>
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700">
                Solve Now <ArrowRight size={16} />
              </button>
            </div>
            <div className="rounded-2xl border bg-white p-6 dark:bg-[#161b22] border-neutral-200/80 dark:border-[#30363d]">
              <h3 className="mb-4 font-normal text-neutral-800 dark:text-neutral-200">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-gray-800">
                  <Zap
                    size={20}
                    className="text-neutral-500 dark:text-neutral-400"
                  />
                  <span className="font-light">Random Problem</span>
                </button>
                <button className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-gray-800">
                  <BarChart3
                    size={20}
                    className="text-neutral-500 dark:text-neutral-400"
                  />
                  <span className="font-light">Practice Contest</span>
                </button>
              </div>
            </div>
            <div className="rounded-2xl border bg-white p-6 dark:bg-[#161b22] border-neutral-200/80 dark:border-[#30363d]">
              <h3 className="mb-4 font-normal text-neutral-800 dark:text-neutral-200">
                Recent Submissions
              </h3>
              <div className="space-y-4">
                {recentSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-normal text-neutral-700 dark:text-neutral-300">
                        {sub.problem}
                      </p>
                      <p className="text-xs font-light text-neutral-400 dark:text-neutral-500">
                        {sub.time}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        sub.status === "Accepted"
                          ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                          : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border bg-white p-6 dark:bg-[#161b22] border-neutral-200/80 dark:border-[#30363d]">
              <h3 className="mb-4 font-normal text-neutral-800 dark:text-neutral-200">
                Achievements
              </h3>
              <div className="space-y-4">
                {achievements.map((ach) => (
                  <div key={ach.title} className="flex items-center gap-3">
                    <div className="text-lg">{ach.icon}</div>
                    <div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-200">
                        {ach.title}
                      </div>
                      <div className="text-xs font-light text-neutral-500 dark:text-neutral-400">
                        {ach.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Practice;
