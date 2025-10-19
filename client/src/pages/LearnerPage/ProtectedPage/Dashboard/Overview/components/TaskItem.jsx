import { ChevronRight } from "lucide-react";

const TaskItem = ({ title, course, date, priority }) => {
  // Updated priority classes to include dark theme variations
  const priorityClasses = {
    high: { dot: "bg-red-500 dark:bg-red-400" },
    medium: { dot: "bg-yellow-500 dark:bg-yellow-400" },
  };
  const colors = priorityClasses[priority];

  return (
    <a
      href="#"
      className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-100/80 transition-colors group dark:hover:bg-slate-800/50"
    >
      {/* Themed priority dot with a fallback for low priority */}
      <div
        className={`w-2 h-2 rounded-full flex-shrink-0 ${
          colors?.dot || "bg-slate-400 dark:bg-slate-500"
        }`}
      ></div>
      <div className="flex-1">
        {/* Themed title text */}
        <p className="font-medium text-slate-800 group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400">
          {title}
        </p>
        {/* Themed secondary text */}
        <p className="text-sm text-slate-500 font-light mt-0.5 dark:text-slate-400">
          {course} · {date}
        </p>
      </div>
      {/* Themed chevron icon */}
      <ChevronRight className="w-5 h-5 text-slate-400 transition-transform group-hover:translate-x-1 dark:text-slate-500" />
    </a>
  );
};

export default TaskItem;