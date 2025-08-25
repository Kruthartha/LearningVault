import React from "react";
import { BookOpen, Target, Award, Users } from "lucide-react";

const DashboardLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Logo Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-light text-black mb-6">
            Learning
            <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-medium">
              Vault
            </span>
          </h1>
        </div>

        {/* Loading Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto relative">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>

            {/* Inner pulsing core */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center animate-pulse">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Floating skill icons */}
          <div className="absolute -top-2 -right-4">
            <div
              className="w-8 h-8 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center animate-bounce"
              style={{ animationDelay: "0.1s" }}
            >
              <Target className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="absolute -bottom-2 -left-4">
            <div
              className="w-8 h-8 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center animate-bounce"
              style={{ animationDelay: "0.3s" }}
            >
              <Award className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <div className="absolute top-1/2 -left-6">
            <div
              className="w-6 h-6 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center animate-bounce"
              style={{ animationDelay: "0.5s" }}
            >
              <Users className="w-3 h-3 text-pink-600" />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-light text-black mb-2">
            Loading Dashboard
          </h2>
          <p className="text-gray-600 font-light">
            Preparing your learning workspace...
          </p>

          {/* Animated dots */}
          <div className="flex justify-center space-x-2 mt-4">
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>

        {/* Mini stats preview (skeleton) */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
            >
              <div className="animate-pulse">
                <div className="w-6 h-6 bg-gray-200 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background decoration matching dashboard style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/6 w-32 h-32 bg-blue-50 rounded-full opacity-30 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/6 w-24 h-24 bg-blue-100 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-4 w-16 h-16 bg-gradient-to-br from-blue-600/5 to-blue-400/5 rounded-full animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes loading-progress {
          0% {
            width: 20%;
          }
          50% {
            width: 80%;
          }
          100% {
            width: 65%;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLoading;
