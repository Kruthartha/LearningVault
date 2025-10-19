// import { professionalDashboardData } from "../context/professionalDashboardData";
import LearnerOverview from "./components/LearnerOverview";

// Use "export" to make this object available to other files
export const professionalDashboardData = {
  user: { first_name: "Kruthartha", last_name: "S Gowda" },
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
  newsroomData : [
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
  {
    id: 2,
    title: "React 18.3 Introduces New Concurrent Features",
    excerpt:
      "Enhanced performance optimizations and better developer experience with automatic batching and improved Suspense handling.",
    category: "Frontend",
    readTime: "3 min read",
    publishedAt: "5 hours ago",
    source: "React Blog",
    sourceUrl: "https://react.dev",
    trending: false,
    views: 892,
    imageUrl:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop",
  },
  {
    id: 3,
    title: "Docker Desktop 4.25 Brings Enhanced Security",
    excerpt:
      "New container scanning features and improved vulnerability detection help developers build more secure applications.",
    category: "DevOps",
    readTime: "4 min read",
    publishedAt: "1 day ago",
    source: "Docker Blog",
    sourceUrl: "https://docker.com",
    trending: true,
    views: 654,
    imageUrl:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=300&h=200&fit=crop",
  },
],
  dailyQuote: {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
  },
  activity: Array.from({ length: 365 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const activityCount = Math.floor(Math.random() * 10);
    let color;
    switch (activityCount) {
      case 0:
        color = "#ebedf0";
        break;
      case 1:
        color = "#9be9a8";
        break;
      case 2:
        color = "#40c463";
        break;
      case 3:
        color = "#30a14e";
        break;
      case 4:
        color = "#216e39";
        break;
      default:
        color = "#ebedf0";
    }
    return {
      count: activityCount,
      date: date.toISOString().split("T")[0],
      color: color,
    };
  }),
};


const App = () => <LearnerOverview data={professionalDashboardData} />;

export default App;
