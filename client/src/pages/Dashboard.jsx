import { useState, useEffect } from "react";
import {
  BookOpen,
  Award,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Target,
  Play,
  CheckCircle,
  Star,
  ArrowRight,
  Bell,
  Search,
  Filter,
  MoreVertical,
  Menu,
  X,
} from "lucide-react";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null); //
  const [loading, setLoading] = useState(true);
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
  ]);

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
      instructor: "Sarah Chen",
      phase: "Skills Foundation",
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

useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("accessToken"); // ✅ get token
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch("https://api.learningvault.in/api/auth/me", {
        headers: {
          "Authorization": `Bearer ${token}`, // ✅ attach token
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Unauthorized");
      }

      const data = await res.json();
      if (data.ok) {
        setUser(data.user);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null); // clear on error
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);

  // 👤 Helper for initials
  const getInitials = (first, last) => {
    if (!first) return "";
    return (first[0] + (last ? last[0] : "")).toUpperCase();
  };

  // If still loading API
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading Dashboard...
      </div>
    );
  }

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

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => {
        onClick(id);
        setMobileMenuOpen(false);
      }}
      className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full md:w-auto ${
        isActive
          ? "bg-slate-800 text-white shadow-sm"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );

  const StatCard = ({ icon: Icon, label, value, change, color = "blue" }) => (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className={`p-2 md:p-3 bg-${color}-50 rounded-xl`}>
          <Icon className={`w-4 h-4 md:w-6 md:h-6 text-${color}-600`} />
        </div>
        {change && (
          <div className="flex items-center text-xs md:text-sm text-green-600">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1" />+{change}%
          </div>
        )}
      </div>
      <div>
        <div className="text-xl md:text-2xl font-light text-gray-900 mb-1">
          {value}
        </div>
        <div className="text-xs md:text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );

  const CourseCard = ({ course }) => (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {course.phase}
            </span>
          </div>
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-xs md:text-sm text-gray-500 mb-4">
            Instructor: {course.instructor}
          </p>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between text-xs md:text-sm mb-2">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">
            {course.completedLessons}/{course.totalLessons} lessons
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
        <div className="text-right text-xs md:text-sm text-gray-500 mt-1">
          {course.progress}%
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs md:text-sm text-gray-500">Next lesson:</p>
          <p className="font-medium text-gray-900 text-sm md:text-base">
            {course.nextLesson}
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm">
          <Play className="w-4 h-4" />
          Continue
        </button>
      </div>
    </div>
  );

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
                <TabButton
                  id="overview"
                  label="Overview"
                  isActive={selectedTab === "overview"}
                  onClick={setSelectedTab}
                />
                <TabButton
                  id="courses"
                  label="My Courses"
                  isActive={selectedTab === "courses"}
                  onClick={setSelectedTab}
                />
                <TabButton
                  id="projects"
                  label="Projects"
                  isActive={selectedTab === "projects"}
                  onClick={setSelectedTab}
                />
                <TabButton
                  id="community"
                  label="Community"
                  isActive={selectedTab === "community"}
                  onClick={setSelectedTab}
                />
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
              <div className="relative">
                <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Bell className="w-5 h-5 md:w-6 md:h-6" />
                  {notifications.some((n) => n.unread) && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                  )}
                </button>
              </div>
              {/* TODO: Add Dynamic Content */}
              {/* Profile */}
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  A
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

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
              <nav className="flex flex-col gap-2">
                <TabButton
                  id="overview"
                  label="Overview"
                  isActive={selectedTab === "overview"}
                  onClick={setSelectedTab}
                />
                <TabButton
                  id="courses"
                  label="My Courses"
                  isActive={selectedTab === "courses"}
                  onClick={setSelectedTab}
                />
                <TabButton
                  id="projects"
                  label="Projects"
                  isActive={selectedTab === "projects"}
                  onClick={setSelectedTab}
                />
                <TabButton
                  id="community"
                  label="Community"
                  isActive={selectedTab === "community"}
                  onClick={setSelectedTab}
                />
              </nav>
              {/* Mobile Search */}
              <div className="relative mt-4">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search courses, projects..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </header>
      {/* TODO: Add Dynamic Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Welcome Section */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-light text-black mb-2 md:mb-4">
            Welcome back, <span className="font-medium">{user.first_name}</span>
          </h2>
          <p className="text-base md:text-xl text-gray-600 font-light">
            Ready to continue your learning journey? You're doing great!
          </p>
        </div>

        {/* Learning Path Progress */}
        <div className="mb-8 md:mb-12">
          <h3 className="text-xl md:text-2xl font-light text-black mb-6 md:mb-8">
            Your Learning Path
          </h3>
          <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
              {learningPath.map((phase, index) => (
                <div
                  key={phase.phase}
                  className="flex items-center w-full sm:w-auto"
                >
                  <div className="flex flex-col items-center flex-1 sm:flex-none">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm font-medium ${
                        phase.completed
                          ? "bg-green-100 text-green-700 border-2 border-green-200"
                          : phase.current
                          ? "bg-blue-100 text-blue-700 border-2 border-blue-200 animate-pulse"
                          : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                      }`}
                    >
                      {phase.completed ? (
                        <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                      ) : (
                        phase.phase
                      )}
                    </div>
                    <div className="mt-3 md:mt-4 text-center">
                      <div
                        className={`text-xs md:text-sm font-medium ${
                          phase.current
                            ? "text-blue-700"
                            : phase.completed
                            ? "text-green-700"
                            : "text-gray-500"
                        }`}
                      >
                        Phase {phase.phase}
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          phase.current
                            ? "text-blue-600"
                            : phase.completed
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {phase.title}
                      </div>
                    </div>
                  </div>
                  {index < learningPath.length - 1 && (
                    <div
                      className={`hidden sm:block w-16 md:w-24 h-0.5 mx-4 ${
                        phase.completed ? "bg-green-200" : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6 mb-8 md:mb-12">
          <StatCard
            icon={BookOpen}
            label="Courses Completed"
            value={studentStats.coursesCompleted}
            change={8}
            color="blue"
          />
          <StatCard
            icon={Target}
            label="Day Streak"
            value={studentStats.currentStreak}
            change={12}
            color="green"
          />
          <StatCard
            icon={Clock}
            label="Hours Learned"
            value={studentStats.totalHours}
            change={15}
            color="purple"
          />
          <StatCard
            icon={Award}
            label="Skills Mastered"
            value={studentStats.skillsLearned}
            change={20}
            color="orange"
          />
          <StatCard
            icon={Star}
            label="Projects Built"
            value={studentStats.projectsBuilt}
            change={25}
            color="yellow"
          />
          <StatCard
            icon={Users}
            label="Mentor Sessions"
            value={studentStats.mentorSessions}
            change={10}
            color="pink"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Current Courses */}
            <div>
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-light text-black">
                  Continue Learning
                </h3>
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View all <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4 md:space-y-6">
                {currentCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 md:space-y-8">
            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
              <h4 className="text-base md:text-lg font-medium text-black mb-4 md:mb-6">
                Upcoming Deadlines
              </h4>
              <div className="space-y-3 md:space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        deadline.priority === "high"
                          ? "bg-red-500"
                          : deadline.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        {deadline.title}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        {deadline.course}
                      </div>
                      <div className="text-xs text-gray-600">
                        Due {deadline.due}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
              <h4 className="text-base md:text-lg font-medium text-black mb-4 md:mb-6">
                Recent Achievements
              </h4>
              <div className="space-y-3 md:space-y-4">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3">
                    <div className="text-xl md:text-2xl">
                      {achievement.icon}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {achievement.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {achievement.description}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {achievement.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
              <h4 className="text-base md:text-lg font-medium text-black mb-4 md:mb-6">
                Quick Actions
              </h4>
              <div className="space-y-2 md:space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    Schedule mentor session
                  </span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    Join study group
                  </span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <BookOpen className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    Browse new courses
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
