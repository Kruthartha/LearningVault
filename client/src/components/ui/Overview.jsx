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

import StatCard from "./StatCard";
import CourseCard from "./CourseCard";

const Overview = ({
  user,
  studentStats,
  currentCourses,
  recentAchievements,
  upcomingDeadlines,
  learningPath,
}) => {
  //   This Componenet has Info about Ongoing Courses in Overview Page

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
                  <div className="text-xl md:text-2xl">{achievement.icon}</div>
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
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 ">
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
                <span className="text-sm text-gray-700">Join study group</span>
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

export default Overview;