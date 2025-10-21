import React from "react";
import {
  TrendingUp,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  ArrowUpRight,
  PlayCircle,
  Flame,
  Star,
  Lightbulb,
  Briefcase,
  LineChart,
  MessageCircle,
  Quote,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // It's good practice to import this if you use it

import ContributionGrid from "./ContributionGrid";
import Widget from "./Widget";
import WelcomeHeader from "./WelcomeHeader";
import PrimaryActionWidget from "./PrimaryActionWidget";
import StatsWidget from "./StatsWidget";
import TaskItem from "./TaskItem";

const LearnerOverview = ({ data }) => {
  const {
    user,
    focus,
    learningPath,
    achievements,
    community,
    techNews,
    newsroomData,
    dailyQuote,
    activity,
  } = data;
  const navigate = useNavigate(); // Initialize navigate

  return (
    // Main background for light and dark modes
    <div className=" min-h-screen font-sans dark:bg-[#0E1116]">
      <div className="max-w-7xl mx-auto space-y-8">
        <WelcomeHeader user={user} />

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* --- LEFT (MAIN) COLUMN --- */}
          <div className="lg:col-span-2 space-y-6">
            <PrimaryActionWidget action={focus} />
            <StatsWidget stats={focus} />
            <ContributionGrid activityData={activity} />

            <Widget
              title="Upcoming Deadlines"
              cta="View Calendar"
              ctaLink="/dashboard/calendar"
            >
              <div className="space-y-1">
                {focus.upcomingTasks.length > 0 ? (
                  focus.upcomingTasks.map((task) => (
                    <TaskItem key={task.id} {...task} />
                  ))
                ) : (
                  // Themed placeholder text
                  <div className="text-center text-slate-500 dark:text-slate-400 py-6">
                    <p>No upcoming assignments. Great job!</p>
                  </div>
                )}
              </div>
            </Widget>

           
          </div>

          {/* --- RIGHT (SIDEBAR) COLUMN --- */}
          <div className="lg:sticky lg:top-8 space-y-6">
            <Widget title="Quote of the Day">
              {/* Using a specific gradient for quote background for better theming */}
              <div className="relative overflow-hidden p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30">
                <Quote
                  className="absolute -bottom-4 -right-4 w-28 h-28 text-blue-200/40 dark:text-white/5"
                  strokeWidth={1.5}
                />
                <div className="relative z-10">
                  <p className="text-lg font-light leading-relaxed text-slate-800 dark:text-slate-200">
                    "{dailyQuote.text}"
                  </p>
                  <p className="text-right text-sm text-blue-700 mt-4 dark:text-blue-400">
                    {dailyQuote.author}
                  </p>
                </div>
              </div>
            </Widget>

            <Widget
              title="Recent Achievements"
              cta="View All"
              ctaLink="/achievements"
            >
              <div className="space-y-2">
                {achievements.map((ach, index) => (
                  <div key={index} className="flex items-center gap-4 p-2">
                    <div className="text-2xl">{ach.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {ach.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {ach.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Widget>

            <div className="space-y-8">
              {/* Themed Trending News card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 dark:bg-[#0e1013] dark:border-[#30363d]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-black flex items-center gap-2 dark:text-white">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-500" />
                    Trending Now
                  </h4>
                  <button
                    onClick={() => navigate("/library/newsroom")}
                    className="text-green-600 font-medium hover:text-green-700 text-sm dark:text-green-500 dark:hover:text-green-400"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {newsroomData.map((news) => (
                    <div
                      key={news.id}
                      className="border-l-4 border-green-500 pl-4 hover:bg-gray-50 p-2 rounded cursor-pointer dark:hover:bg-slate-800/50"
                      onClick={() => navigate(`/library/newsroom/${news.id}`)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium dark:bg-green-500/10 dark:text-green-400">
                          {news.readTime}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-slate-400">
                          {news.publishedAt}
                        </span>
                      </div>
                      <h5 className="text-sm font-medium text-black mb-1 hover:text-green-600 dark:text-slate-200 dark:hover:text-green-500">
                        {news.title}
                      </h5>
                      <p className="text-xs text-gray-600 dark:text-slate-400">
                        {news.excerpt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerOverview;
