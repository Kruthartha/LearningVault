import { Play, MoreVertical, CheckCircle, Eye } from "lucide-react";

const CourseCard = ({ course }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                course.status === "completed"
                  ? "text-green-600 bg-green-50"
                  : course.status === "in-progress"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 bg-gray-50"
              }`}
            >
              {course.phase}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                course.difficulty === "Beginner"
                  ? "text-green-600 bg-green-100"
                  : course.difficulty === "Intermediate"
                  ? "text-yellow-600 bg-yellow-100"
                  : "text-red-600 bg-red-100"
              }`}
            >
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

      {course.status !== "not-started" && (
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
                  ? "bg-gradient-to-r from-green-500 to-green-400"
                  : "bg-gradient-to-r from-blue-600 to-blue-400"
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
          {course.status === "completed" ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Completed</span>
            </div>
          ) : course.status === "not-started" ? (
            <div>
              <p className="text-sm text-gray-500">Ready to start:</p>
              <p className="font-medium text-gray-900">{course.nextLesson}</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500">Next lesson:</p>
              <p className="font-medium text-gray-900">{course.nextLesson}</p>
            </div>
          )}
        </div>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            course.status === "completed"
              ? "bg-green-50 text-green-600 hover:bg-green-100"
              : course.status === "not-started"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-slate-800 text-white hover:bg-slate-700"
          }`}
        >
          {course.status === "completed" ? (
            <>
              <Eye className="w-4 h-4" />
              Review
            </>
          ) : course.status === "not-started" ? (
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
export default CourseCard;
