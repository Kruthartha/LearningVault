import { useState } from "react";
import { BookOpen, Search } from "lucide-react";
import CourseCard from "./CourseCard";

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
      difficulty: "Intermediate",
      duration: "6 weeks",
      category: "Full-Stack",
      status: "in-progress",
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
      status: "in-progress",
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
      status: "completed",
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
      status: "not-started",
    },
  ];

  const filteredCourses = allCourses.filter((course) => {
    const matchesFilter = filter === "all" || course.status === filter;
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-light text-black mb-4">My Courses</h2>
        <p className="text-xl text-gray-600 font-light">
          Track your learning progress across all courses
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All Courses" },
              { key: "in-progress", label: "In Progress" },
              { key: "completed", label: "Completed" },
              { key: "not-started", label: "Not Started" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? "bg-slate-800 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No courses found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
