import { useState, useEffect, useRef } from "react";
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
  Code,
  MessageSquare,
  GitBranch,
  Zap,
  FileText,
  Video,
  Download,
  Heart,
  Share2,
  Eye,
} from "lucide-react";

// Overview Component 
const Overview = ({ user, studentStats, currentCourses, recentAchievements, upcomingDeadlines, learningPath }) => {

// which contains Courses Completed, Day Streak and Everything
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

//   This Componenet has Info about Ongoing Courses in Overview Page
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl md:text-4xl font-light text-black mb-2 md:mb-4">
          Welcome back, <span className="font-medium">{user.first_name}</span>
        </h2>
        <p className="text-base md:text-xl text-gray-600 font-light">
          Ready to continue your learning journey? You're doing great!
        </p>
      </div>

      {/* Learning Path Progress */}
      <div>
        <h3 className="text-xl md:text-2xl font-light text-black mb-6 md:mb-8">
          Your Learning Path
        </h3>
        <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            {learningPath.map((phase, index) => (
              <div key={phase.phase} className="flex items-center w-full sm:w-auto">
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
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
  );
};

// My Courses Component
const MyCourses = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const allCourses = [
    {
      id: 1,
      title: "Advanced React Development",
      progress: 68,
      totalLessons: 24,
      completedLessons: 16,
      nextLesson: "Custom Hooks Deep Dive",
      instructor: "Sarah Chen",
      phase: "Skills Foundation",
      difficulty: "Advanced",
      duration: "8 weeks",
      category: "Frontend",
      status: "in-progress"
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
      difficulty: "Intermediate",
      duration: "6 weeks",
      category: "Full-Stack",
      status: "in-progress"
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
      difficulty: "Beginner",
      duration: "4 weeks",
      category: "Career",
      status: "in-progress"
    },
    {
      id: 4,
      title: "JavaScript Fundamentals",
      progress: 100,
      totalLessons: 20,
      completedLessons: 20,
      nextLesson: "Course Completed",
      instructor: "David Kim",
      phase: "Skills Foundation",
      difficulty: "Beginner",
      duration: "5 weeks",
      category: "Frontend",
      status: "completed"
    },
    {
      id: 5,
      title: "Node.js Backend Development",
      progress: 0,
      totalLessons: 16,
      completedLessons: 0,
      nextLesson: "Setting up Express Server",
      instructor: "Lisa Zhang",
      phase: "Skills Foundation",
      difficulty: "Intermediate",
      duration: "7 weeks",
      category: "Backend",
      status: "not-started"
    }
  ];

  const filteredCourses = allCourses.filter(course => {
    const matchesFilter = filter === "all" || course.status === filter;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const CourseCard = ({ course }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              course.status === 'completed' 
                ? 'text-green-600 bg-green-50'
                : course.status === 'in-progress'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 bg-gray-50'
            }`}>
              {course.phase}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              course.difficulty === 'Beginner'
                ? 'text-green-600 bg-green-100'
                : course.difficulty === 'Intermediate'
                ? 'text-yellow-600 bg-yellow-100'
                : 'text-red-600 bg-red-100'
            }`}>
              {course.difficulty}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            Instructor: {course.instructor}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{course.duration}</span>
            <span>•</span>
            <span>{course.category}</span>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {course.status !== 'not-started' && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">
              {course.completedLessons}/{course.totalLessons} lessons
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                course.progress === 100 
                  ? 'bg-gradient-to-r from-green-500 to-green-400'
                  : 'bg-gradient-to-r from-blue-600 to-blue-400'
              }`}
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
          <div className="text-right text-sm text-gray-500 mt-1">
            {course.progress}%
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex-1">
          {course.status === 'completed' ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Completed</span>
            </div>
          ) : course.status === 'not-started' ? (
            <div>
              <p className="text-sm text-gray-500">Ready to start:</p>
              <p className="font-medium text-gray-900">
                {course.nextLesson}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500">Next lesson:</p>
              <p className="font-medium text-gray-900">
                {course.nextLesson}
              </p>
            </div>
          )}
        </div>
        <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
          course.status === 'completed'
            ? 'bg-green-50 text-green-600 hover:bg-green-100'
            : course.status === 'not-started'
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-slate-800 text-white hover:bg-slate-700'
        }`}>
          {course.status === 'completed' ? (
            <>
              <Eye className="w-4 h-4" />
              Review
            </>
          ) : course.status === 'not-started' ? (
            <>
              <Play className="w-4 h-4" />
              Start
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Continue
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-light text-black mb-4">My Courses</h2>
        <p className="text-xl text-gray-600 font-light">
          Track your learning progress across all courses
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Courses' },
              { key: 'in-progress', label: 'In Progress' },
              { key: 'completed', label: 'Completed' },
              { key: 'not-started', label: 'Not Started' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-slate-800 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

// Projects Component
const Projects = () => {
  const [filter, setFilter] = useState("all");
  
  const projects = [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "A full-stack e-commerce application built with React and Node.js",
      status: "completed",
      technologies: ["React", "Node.js", "MongoDB", "Express"],
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop",
      completedDate: "2024-01-15",
      likes: 24,
      views: 156,
      githubUrl: "#",
      liveUrl: "#"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A productivity app with real-time collaboration features",
      status: "in-progress",
      technologies: ["Vue.js", "Firebase", "Tailwind CSS"],
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop",
      progress: 75,
      dueDate: "2024-02-20",
      likes: 12,
      views: 89,
      githubUrl: "#"
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "Interactive weather application with data visualization",
      status: "completed",
      technologies: ["JavaScript", "Chart.js", "OpenWeather API"],
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=200&fit=crop",
      completedDate: "2023-12-10",
      likes: 18,
      views: 134,
      githubUrl: "#",
      liveUrl: "#"
    },
    {
      id: 4,
      title: "Portfolio Website",
      description: "Personal portfolio showcasing projects and skills",
      status: "planning",
      technologies: ["Next.js", "TypeScript", "Framer Motion"],
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=200&fit=crop",
      startDate: "2024-03-01",
      likes: 5,
      views: 23
    }
  ];

  const filteredProjects = projects.filter(project => 
    filter === "all" || project.status === filter
  );

  const ProjectCard = ({ project }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            project.status === 'completed' 
              ? 'bg-green-100 text-green-600'
              : project.status === 'in-progress'
              ? 'bg-blue-100 text-blue-600'
              : 'bg-yellow-100 text-yellow-600'
          }`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
          </span>
        </div>
        
        {project.status === 'in-progress' && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {project.technologies.map((tech) => (
            <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{project.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{project.views}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <GitBranch className="w-4 h-4" />
              </button>
            )}
            {project.liveUrl && (
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-light text-black mb-4">Projects</h2>
        <p className="text-xl text-gray-600 font-light">
          Showcase your skills through hands-on projects
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Projects' },
            { key: 'completed', label: 'Completed' },
            { key: 'in-progress', label: 'In Progress' },
            { key: 'planning', label: 'Planning' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-slate-800 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Add New Project */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="max-w-md mx-auto">
          <Code className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start a New Project</h3>
          <p className="text-gray-500 mb-6">Apply your skills to a real-world project and build your portfolio.</p>
          <button className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors">
            Browse Project Ideas
          </button>
        </div>
      </div>
    </div>
  );
};

// Community Component
const Community = () => {
  const [activeTab, setActiveTab] = useState("discussions");
  
  const discussions = [
    {
      id: 1,
      title: "Best practices for React state management in 2024?",
      author: "Sarah Johnson",
      avatar: "SJ",
      replies: 23,
      likes: 45,
      timeAgo: "2h ago",
      tags: ["React", "State Management", "Redux"],
      isAnswered: true
    },
    {
      id: 2,
      title: "How to optimize database queries in Node.js applications",
      author: "Mike Chen",
      avatar: "MC",
      replies: 12,
      likes: 31,
      timeAgo: "4h ago",
      tags: ["Node.js", "Database", "Performance"],
      isAnswered: false
    },
    {
      id: 3,
      title: "Career advice: Transitioning from frontend to full-stack",
      author: "Emily Rodriguez",
      avatar: "ER",
      replies: 18,
      likes: 62,
      timeAgo: "1d ago",
      tags: ["Career", "Full-Stack", "Advice"],
      isAnswered: true
    }
  ];

  const studyGroups = [
    {
      id: 1,
      name: "React Study Group",
      members: 24,
      nextSession: "Tomorrow 7PM",
      topic: "Advanced React Patterns",
      isJoined: true
    },
    {
      id: 2,
      name: "JavaScript Algorithms",
      members: 18,
      nextSession: "Friday 6PM",
      topic: "Dynamic Programming",
      isJoined: false
    },
    {
      id: 3,
      name: "Full-Stack Project Team",
      members: 12,
      nextSession: "Sunday 3PM",
      topic: "E-commerce Platform Build",
      isJoined: true
    }
  ];

  const events = [
    {
      id: 1,
      title: "Web Development Workshop",
      date: "Feb 15, 2024",
      time: "2:00 PM - 4:00 PM",
      attendees: 45,
      type: "Workshop",
      isRegistered: true
    },
    {
      id: 2,
      title: "Career Fair 2024",
      date: "Feb 22, 2024",
      time: "10:00 AM - 6:00 PM",
      attendees: 120,
      type: "Career Fair",
      isRegistered: false
    },
    {
      id: 3,
      title: "Tech Talk: Future of AI",
      date: "Mar 5, 2024",
      time: "7:00 PM - 8:30 PM",
      attendees: 89,
      type: "Tech Talk",
      isRegistered: false
    }
  ];

  const DiscussionCard = ({ discussion }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
          {discussion.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
              {discussion.title}
            </h3>
            {discussion.isAnswered && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </div>
          <p className="text-sm text-gray-600 mb-3">by {discussion.author}</p>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {discussion.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{discussion.replies} replies</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{discussion.likes} likes</span>
              </div>
            </div>
            <span>{discussion.timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const StudyGroupCard = ({ group }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{group.name}</h3>
          <p className="text-sm text-gray-600">{group.members} members</p>
        </div>
        <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          group.isJoined 
            ? 'bg-green-50 text-green-600 border border-green-200'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}>
          {group.isJoined ? 'Joined' : 'Join'}
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Next session:</span>
          <span className="font-medium text-gray-900">{group.nextSession}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Topic:</span>
          <span className="font-medium text-gray-900">{group.topic}</span>
        </div>
      </div>
    </div>
  );

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium mb-2 inline-block ${
            event.type === 'Workshop' 
              ? 'bg-blue-100 text-blue-600'
              : event.type === 'Career Fair'
              ? 'bg-green-100 text-green-600'
              : 'bg-purple-100 text-purple-600'
          }`}>
            {event.type}
          </span>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{event.title}</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{event.attendees} attendees</span>
            </div>
          </div>
        </div>
      </div>
      
      <button className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
        event.isRegistered
          ? 'bg-green-50 text-green-600 border border-green-200'
          : 'bg-slate-800 text-white hover:bg-slate-700'
      }`}>
        {event.isRegistered ? 'Registered' : 'Register'}
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-light text-black mb-4">Community</h2>
        <p className="text-xl text-gray-600 font-light">
          Connect, learn, and grow with fellow developers
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
        <div className="flex gap-1">
          {[
            { key: 'discussions', label: 'Discussions', icon: MessageSquare },
            { key: 'study-groups', label: 'Study Groups', icon: Users },
            { key: 'events', label: 'Events', icon: Calendar }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'discussions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium text-gray-900">Recent Discussions</h3>
            <button className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
              Start Discussion
            </button>
          </div>
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <DiscussionCard key={discussion.id} discussion={discussion} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'study-groups' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium text-gray-900">Study Groups</h3>
            <button className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
              Create Group
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyGroups.map((group) => (
              <StudyGroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium text-gray-900">Upcoming Events</h3>
            <button className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
              Propose Event
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Dashboard Component
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
  ]);

  // Mock user data
  const user = {
    first_name: "Kruthartha",
    last_name: "S Gowda"
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
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
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
                  { id: 'overview', label: 'Overview' },
                  { id: 'courses', label: 'My Courses' },
                  { id: 'projects', label: 'Projects' },
                  { id: 'community', label: 'Community' }
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
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setShowNotifications(false)}></div>
                    
                    {/* Notification Panel */}
                    <div className={`
                      absolute z-50 bg-white rounded-xl shadow-lg border border-gray-100
                      ${/* Mobile: Full width with margins, Desktop: Fixed width */ ''}
                      fixed md:absolute 
                      left-4 right-4 top-16 md:left-auto md:right-0 md:top-full
                      md:w-80 md:mt-2
                      max-h-[calc(100vh-5rem)] md:max-h-96
                    `}>
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
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
                      <div className="overflow-y-auto max-h-80 md:max-h-96">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-gray-500">
                            <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            <p>No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-gray-50 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer ${
                                notification.unread ? "bg-blue-50/30" : ""
                              }`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="text-lg flex-shrink-0">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm leading-relaxed ${
                                    notification.unread ? "font-medium text-gray-900" : "text-gray-700"
                                  }`}>
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
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h3>
                      <div className="space-y-2">
                        <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                          <Calendar className="w-5 h-5 text-gray-600" />
                          <span className="text-sm text-gray-700">Schedule mentor session</span>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                          <Users className="w-5 h-5 text-gray-600" />
                          <span className="text-sm text-gray-700">Join study group</span>
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
                        <div className="text-xs text-gray-500">Full-Stack Track</div>
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