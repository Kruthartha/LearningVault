import { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Award,
  Calendar,
  Clock,
  Users,
  Target,
  CheckCircle,
  Star,
  ArrowRight,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";

import MyCourses from "../components/ui/MyCourses";
import Projects from "../components/ui/Projects";
import Community from "../components/ui/Community";
import Overview from "../components/ui/Overview";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "achievement",
      message: "You earned a new badge: React Fundamentals Master!",
      time: "2h ago",
      unread: true,
    },
    {
      id: 2,
      type: "reminder",
      message: "JavaScript Algorithms assignment due tomorrow",
      time: "4h ago",
      unread: true,
    },
    {
      id: 3,
      type: "update",
      message: "New project available: E-commerce Platform",
      time: "1d ago",
      unread: false,
    },
    {
      id: 4,
      type: "update",
      message: "New project available: E-commerce Platform",
      time: "1d ago",
      unread: false,
    },
    {
      id: 5,
      type: "update",
      message: "New project available: E-commerce Platform",
      time: "1d ago",
      unread: false,
    },
    {
      id: 6,
      type: "update",
      message: "New project available: E-commerce Platform",
      time: "1d ago",
      unread: false,
    },
    {
      id: 7,
      type: "update",
      message: "New project available: E-commerce Platform",
      time: "1d ago",
      unread: false,
    },
  ]);

  // Mock user data
  const user = {
    first_name: "Kruthartha",
    last_name: "S Gowda",
  };

  // Mock data
  const studentStats = {
    coursesCompleted: 12,
    currentStreak: 15,
    totalHours: 127,
    skillsLearned: 28,
    projectsBuilt: 8,
    mentorSessions: 6,
  };

  const currentCourses = [
    {
      id: 1,
      title: "Advanced React Development",
      progress: 68,
      totalLessons: 24,
      completedLessons: 16,
      nextLesson: "Custom Hooks Deep Dive",
      instructor: "Kruthartha S Gowda",
      phase: "Skills Foundation",
      difficulty: "Advanced",
      duration: "8 weeks",
      category: "Frontend",
      status: "not-started",
    },
    {
      id: 2,
      title: "Full-Stack Portfolio Project",
      progress: 45,
      totalLessons: 18,
      completedLessons: 8,
      nextLesson: "Database Design",
      instructor: "Marcus Rodriguez",
      phase: "Proof of Skills",
    },
    {
      id: 3,
      title: "Career Preparation Bootcamp",
      progress: 22,
      totalLessons: 12,
      completedLessons: 3,
      nextLesson: "Technical Interview Prep",
      instructor: "Emily Parker",
      phase: "Launch Your Next Chapter",
    },
  ];

  const recentAchievements = [
    {
      id: 1,
      title: "React Master",
      description: "Completed React Fundamentals",
      date: "2 days ago",
      icon: "🏆",
    },
    {
      id: 2,
      title: "Code Warrior",
      description: "Solved 50 coding challenges",
      date: "1 week ago",
      icon: "⚔️",
    },
    {
      id: 3,
      title: "Team Player",
      description: "Collaborated on 3 projects",
      date: "2 weeks ago",
      icon: "🤝",
    },
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: "JavaScript Algorithms Assignment",
      course: "Data Structures & Algorithms",
      due: "Tomorrow",
      priority: "high",
    },
    {
      id: 2,
      title: "React Portfolio Review",
      course: "Advanced React",
      due: "3 days",
      priority: "medium",
    },
    {
      id: 3,
      title: "Mock Interview Session",
      course: "Career Prep",
      due: "1 week",
      priority: "low",
    },
  ];

  const learningPath = [
    { phase: 1, title: "Skills Foundation", completed: false, current: true },
    { phase: 2, title: "Proof of Skills", completed: false, current: false },
    {
      phase: 3,
      title: "Launch Your Next Chapter",
      completed: false,
      current: false,
    },
  ];

  // Helper for initials
  const getInitials = (first, last) => {
    if (!first) return "";
    return (first[0] + (last ? last[0] : "")).toUpperCase();
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, unread: false }))
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "achievement":
        return "🏆";
      case "reminder":
        return "⏰";
      case "update":
        return "📢";
      default:
        return "📧";
    }
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderContent = () => {
    switch (selectedTab) {
      case "overview":
        return (
          <Overview
            user={user}
            studentStats={studentStats}
            currentCourses={currentCourses}
            recentAchievements={recentAchievements}
            upcomingDeadlines={upcomingDeadlines}
            learningPath={learningPath}
          />
        );
      case "courses":
        return <MyCourses />;
      case "projects":
        return <Projects />;
      case "community":
        return <Community />;
      default:
        return (
          <Overview
            user={user}
            studentStats={studentStats}
            currentCourses={currentCourses}
            recentAchievements={recentAchievements}
            upcomingDeadlines={upcomingDeadlines}
            learningPath={learningPath}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-8">
              <div className="flex items-center gap-3">
                <h1 className="text-xl md:text-2xl font-light text-black">
                  Learning
                  <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-medium">
                    Vault
                  </span>
                </h1>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "courses", label: "My Courses" },
                  { id: "projects", label: "Projects" },
                  { id: "community", label: "Community" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedTab(id)}
                    className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      selectedTab === id
                        ? "bg-slate-800 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Desktop Search */}
              <div className="relative hidden lg:block">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search courses, projects..."
                  className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Mobile Search Button */}
              <button className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Bell className="w-5 h-5 md:w-6 md:h-6" />
                  {notifications.some((n) => n.unread) && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </button>

                {/* Notifications Dropdown - Mobile & Desktop Responsive */}
                {showNotifications && (
                  <>
                    {/* Mobile Full Screen Overlay */}
                    <div
                      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                      onClick={() => setShowNotifications(false)}
                    ></div>

                    {/* Notification Panel */}
                    <div
                      className={`
                      absolute z-50 bg-white rounded-xl shadow-lg border border-gray-100
                      ${
                        /* Mobile: Full width with margins, Desktop: Fixed width */ ""
                      }
                      fixed md:absolute 
                      left-4 right-4 top-16 md:left-auto md:right-0 md:top-full
                      md:w-80 md:mt-2
                      max-h-[calc(100vh-5rem)] md:max-h-96
                    `}
                    >
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">
                            Notifications
                          </h3>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={markAllAsRead}
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              Mark all read
                            </button>
                            <button
                              onClick={() => setShowNotifications(false)}
                              className="md:hidden p-1 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="overflow-y-auto max-h-100 md:max-h-80">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-gray-500">
                            <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            <p>No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-gray-50 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer  rounded-2xl${
                                notification.unread ? "bg-blue-50/30" : ""
                              }`}
                              onClick={() =>
                                markNotificationAsRead(notification.id)
                              }
                            >
                              <div className="flex items-start gap-3">
                                <div className="text-lg flex-shrink-0">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-sm leading-relaxed ${
                                      notification.unread
                                        ? "font-medium text-gray-900"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-2">
                                    {notification.time}
                                  </p>
                                </div>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Profile */}
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {getInitials(user.first_name, user.last_name)}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="text-xs text-gray-500">Full-Stack Track</div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu with Blur Overlay */}
          {mobileMenuOpen && (
            <>
              {/* Blur Overlay */}
              <div
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setMobileMenuOpen(false)}
              ></div>

              {/* Mobile Menu Panel */}
              <div className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-lg border-l border-gray-100 z-50 shadow-2xl">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-lg font-medium text-gray-900">Menu</h2>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex-1 p-6">
                    <nav className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setSelectedTab("overview");
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                          selectedTab === "overview"
                            ? "bg-slate-800 text-white shadow-sm"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <Target className="w-5 h-5" />
                        <span className="font-medium">Overview</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedTab("courses");
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                          selectedTab === "courses"
                            ? "bg-slate-800 text-white shadow-sm"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <BookOpen className="w-5 h-5" />
                        <span className="font-medium">My Courses</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedTab("projects");
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                          selectedTab === "projects"
                            ? "bg-slate-800 text-white shadow-sm"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <Star className="w-5 h-5" />
                        <span className="font-medium">Projects</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedTab("community");
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                          selectedTab === "community"
                            ? "bg-slate-800 text-white shadow-sm"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Community</span>
                      </button>
                    </nav>

                    {/* Mobile Search */}
                    <div className="relative mt-6">
                      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search courses, projects..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                      />
                    </div>

                    {/* Quick Actions in Mobile Menu */}
                    <div className="mt-8">
                      <h3 className="text-sm font-medium text-gray-500 mb-3">
                        Quick Actions
                      </h3>
                      <div className="space-y-2">
                        <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                          <Calendar className="w-5 h-5 text-gray-600" />
                          <span className="text-sm text-gray-700">
                            Schedule mentor session
                          </span>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                          <Users className="w-5 h-5 text-gray-600" />
                          <span className="text-sm text-gray-700">
                            Join study group
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Footer with User Info */}
                  <div className="p-6 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-medium">
                        {getInitials(user.first_name, user.last_name)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Full-Stack Track
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
