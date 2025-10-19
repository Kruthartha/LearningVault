import React from "react";
import { ChevronRight } from "lucide-react";

const Widget = ({ title, cta, ctaLink, children, className }) => (
  <div
    className={`bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/80 dark:bg-[#0e1013] dark:border-[#30363d] ${className}`}
  >
    {(title || cta) && (
      <div className="flex justify-between items-center p-4 border-b border-slate-200/80 dark:border-[#30363d]/80">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          {title}
        </h3>
        {cta && (
          <a
            href={ctaLink}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 dark:text-blue-400 dark:hover:text-blue-500"
          >
            {cta} <ChevronRight className="w-4 h-4" />
          </a>
        )}
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
);

export default Widget;
