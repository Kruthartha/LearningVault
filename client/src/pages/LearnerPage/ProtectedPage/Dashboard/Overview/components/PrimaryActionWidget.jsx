import { PlayCircle } from "lucide-react";
import Widget from "./Widget";

const PrimaryActionWidget = ({ action }) => (
  <Widget>
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <p className="text-sm font-light text-slate-500 dark:text-slate-400">
          Your Focus
        </p>
        <p className="text-xl font-medium text-slate-900 mt-1 dark:text-slate-100">
          {action.title}
        </p>
      </div>
      <a
        href={action.link}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold transition-transform hover:scale-105 active:scale-100 w-full sm:w-auto"
      >
        <PlayCircle className="w-5 h-5" /> {action.cta}
      </a>
    </div>
  </Widget>
);

export default PrimaryActionWidget;
