// src/components/ThemeToggleButton.jsx
import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../../components/ThemeProvider";
import { Sun, Moon, TvMinimal } from "lucide-react";

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);

  const icons = { light: Sun, dark: Moon, system: TvMinimal };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setExpanded(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (t) => {
    setTheme(t);
    setExpanded(false);
  };

  const CurrentIcon = icons[theme];

  return (
    <div ref={ref} className="relative inline-flex items-center">
      <div
        className={`flex items-center rounded-full backdrop-blur-md overflow-hidden h-10 
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${expanded ? "w-[132px]" : "w-10"}
          border border-gray-300/50 dark:border-white/10 
          bg-white/70 dark:bg-gray-800/60 `}
      >
        {/* Expanded buttons (always in DOM to prevent jumping) */}
        <div
          className={`grid grid-cols-3 gap-[6px] w-full place-items-center transition-all duration-500
            ${expanded ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}`}
          role="toolbar"
          aria-label="Theme options"
        >
          {["light", "dark", "system"].map((t, i) => {
            const Icon = icons[t];
            const isActive = theme === t;
            return (
              <button
                key={t}
                onClick={() => handleSelect(t)}
                aria-pressed={isActive}
                aria-label={`Set ${t} theme`}
                style={{ transitionDelay: `${i * 50}ms` }}
                className={`flex items-center justify-center h-[34px] w-[34px] rounded-full transition-all duration-300 animate-fadePop
                  ${
                    isActive
                      ? "bg-slate-900 dark:bg-gray-700 text-white dark:text-gray-100 scale-[1.05] "
                      : "text-gray-600 dark:text-gray-400 hover:bg-white/40 dark:hover:bg-white/10 hover:scale-[1.08]"
                  }`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </button>
            );
          })}
        </div>

        {/* Collapsed button */}
        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            aria-label="Change theme"
            className="absolute left-0 flex items-center justify-center w-10 h-10 rounded-full transition-transform duration-200 hover:scale-[1.08] active:scale-[0.95] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400/70"
          >
            <CurrentIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
          </button>
        )}
      </div>

      {/* animations */}
      <style>{`
        @keyframes fadePop {
          from { opacity: 0; transform: scale(0.8) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadePop {
          animation: fadePop 0.25s ease-out both;
        }
      `}</style>
    </div>
  );
}