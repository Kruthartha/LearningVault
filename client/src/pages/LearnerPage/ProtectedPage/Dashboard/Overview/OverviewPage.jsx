import React, { useState, useEffect } from "react";
import LearnerOverview from "./components/LearnerOverview";

// --- Mock Data (used as a template and for missing API data) ---
// This is the static data you provided. We'll use it as a base.
const mockData = {
  // This user object will be OVERWRITTEN by the API data
  user: { first_name: " ", last_name: "S Gowda" },
  focus: {
    title: "Start 'React.js Fundamentals'",
    link: "/course/react",
    cta: "Start Learning",
    streak: 70,
    skills: 5,
    level: 12,
    hours: 4.5,
    upcomingTasks: [
      {
        id: 1,
        title: "Module 3 Quiz",
        course: "Web Dev Basics",
        date: "Due in 20 days",
        priority: "high",
      },
      {
        id: 2,
        title: "Final Project Draft",
        course: "UI/UX Design",
        date: "Due Fri",
        priority: "medium",
      },
    ],
  },
  learningPath: [
    {
      title: "React.js Fundamentals",
      progress: 75,
      nextStep: "Next: State Management",
    },
    {
      title: "Advanced Node.js",
      progress: 40,
      nextStep: "Next: Authentication",
    },
  ],
  achievements: [
    {
      id: 1,
      title: "Completed 'React Router'",
      date: "2 days ago",
      icon: "🏆",
    },
    { id: 2, title: "10-day streak!", date: "1 week ago", icon: "🔥" },
  ],
  techNews: [
    {
      id: 1,
      headline: "Quantum Computing Reaches New Milestone in Scalability",
      source: "TechCrunch",
      timestamp: "2h ago",
      category: "AI",
      url: "https://techcrunch.com",
    },
    {
      id: 2,
      headline: "The Top 5 Frameworks for Building Web Apps in 2025",
      source: "The Verge",
      timestamp: "8h ago",
      category: "Dev",
      url: "#",
    },
    {
      id: 3,
      headline: "Cybersecurity Firm Uncovers Major Zero-Day Vulnerability",
      source: "Wired",
      timestamp: "1d ago",
      category: "Security",
      url: "#",
    },
  ],
  newsroomData: [
    {
      id: 1,
      title: "OpenAI Releases GPT-4 Turbo with Vision Capabilities",
      excerpt:
        "The latest model combines text and image understanding with improved efficiency and reduced costs for developers worldwide.",
      category: "AI News",
      readTime: "2 min read",
      publishedAt: "2 hours ago",
      source: "TechCrunch",
      sourceUrl: "https://techcrunch.com",
      trending: true,
      views: 1240,
      imageUrl:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop",
    },
    // ... other newsroomData objects
  ],
  dailyQuote: {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
  },
  activity: [], // This will be filled by the API
};

// --- Helper Functions ---

/**
 * Transforms the API's activityData into the format required by the heatmap.
 * @param {Array} activityData - The array from apiData.learningActivity.activityData
 * @returns {Array} - The transformed array with date, count, and color
 */
const transformActivity = (activityData) => {
  return (activityData || []).map((item) => {
    let color;
    const count = item.count;

    // This logic replicates the color-coding from your original mock data
    if (count === 0) color = "#ebedf0"; // No activity
    else if (count <= 2) color = "#9be9a8"; // Low
    else if (count <= 5) color = "#40c463"; // Medium
    else if (count <= 8) color = "#30a14e"; // High
    else color = "#216e39"; // Very high

    return {
      count: item.count,
      date: item.date,
      color: color,
    };
  });
};

/**
 * Formats an ISO date string into a relative due date.
 * @param {string} isoDate - The ISO date string from the API
 * @returns {string} - A human-readable string (e.g., "Due today", "Due Mon", "Due in 5 days")
 */
const formatDueDate = (isoDate) => {
  try {
    const today = new Date();
    const dueDate = new Date(isoDate);

    // Normalize to start of day for accurate day difference
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "Overdue";
    }
    if (diffDays === 0) {
      return "Due today";
    }
    if (diffDays === 1) {
      return "Due tomorrow";
    }
    // Show "Due [Weekday]" if it's within the next week
    if (diffDays <= 7) {
      const weekday = dueDate.toLocaleDateString("en-US", { weekday: "short" });
      return `Due ${weekday}`;
    }
    // Otherwise, show "Due in X days"
    return `Due in ${diffDays} days`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

/**
 * [MODIFIED] Merges the live API data into the static mock data structure.
 * This ensures the LearnerOverview component gets the props it expects.
 * @param {Object} apiData - The "data" object from your API response
 * @returns {Object} - The final data object for the component
 */
const transformApiData = (apiData) => {
  // Start with the mock data as a template
  const newData = { ...mockData };

  // --- [NEW] 1. Overwrite User Name ---
  // Make the user's first name dynamic based on the API response.
  if (apiData.firstName) {
    newData.user = {
      first_name: apiData.firstName,
      last_name: "", // API doesn't provide a last name, so we clear the mock data.
    };
  }

  // --- 2. Transform tasks from the API ---
  const upcomingTasks = (apiData.tasks || []).map((task) => ({
    id: task.id,
    title: task.title,
    course: task.course,
    date: formatDueDate(task.date), // Use our new helper function
    priority: task.priority,
  }));

  // --- 3. Overwrite main "focus" and stats block ---
  newData.focus = {
    ...mockData.focus, // Keep any mock data fields not in the API (like upcomingTasks)
    title: apiData.focus.title,
    link: apiData.focus.link,
    cta: apiData.focus.cta,
    streak: apiData.learningActivity?.currentStreak || 0, // Add safety check
    skills: apiData.skillsUnlocked,
    level: apiData.level,
    hours: apiData.thisWeekHours,
    upcomingTasks: upcomingTasks, // Use the newly transformed tasks
  };

  // --- 4. Transform and set the activity heatmap data ---
  newData.activity = transformActivity(apiData.learningActivity?.activityData);

  // --- 5. Transform the Quote of the Day ---
  if (apiData.quoteOfTheDay && apiData.quoteOfTheDay.quote) {
    newData.dailyQuote = {
      // Use regex to remove leading/trailing smart quotes or standard quotes
      text: apiData.quoteOfTheDay.quote.replace(/^[“"]|["”]$/g, ""),
      author: apiData.quoteOfTheDay.author,
    };
  }
  // If apiData.quoteOfTheDay is missing, it will just keep the mockData.dailyQuote

  // Note: learningPath, achievements, techNews, etc.
  // are not in your API response, so they will keep their mock data values.

  return newData;
};

// --- Main App Component ---

// Use a placeholder URL or environment variable
const API_URL = import.meta.env.VITE_API_URL;

const App = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Get the token from wherever you store it (e.g., localStorage)
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("You are not logged in.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/user/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Failed to fetch dashboard data");
        }

        const apiResponse = await response.json();

        if (apiResponse.ok && apiResponse.data) {
          // Transform the API data into the shape our component needs
          const finalData = transformApiData(apiResponse.data);
          setDashboardData(finalData);
        } else {
          throw new Error(
            "API response was not successful or data is missing."
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // The empty array [] means this effect runs once when the component mounts

  // --- Render Logic ---

if (isLoading) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg text-gray-700">Loading Dashboard...</p>
    </div>
  );
}

  if (error) {
    return (
      <div className="p-8 m-auto max-w-lg text-center bg-red-100 text-red-700 rounded-lg">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-8 text-center text-lg">No dashboard data found.</div>
    );
  }

  // Once data is loaded and transformed, render the component
  return <LearnerOverview data={dashboardData} />;
};

export default App;
