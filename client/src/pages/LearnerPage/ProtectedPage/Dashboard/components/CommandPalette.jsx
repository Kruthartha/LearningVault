import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

const CommandPalette = ({ open, setOpen, setSearchTerm }) => {
  const inputRef = useRef(null);

  // Focus when open
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setOpen]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-gray-500/25 backdrop-blur-sm dark:bg-black/60"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl mx-5 overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-2xl shadow-2xl dark:bg-gradient-to-b dark:from-[#0a0a0a] dark:to-[#111] dark:border-gray-800 dark:shadow-[0_0_20px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800/80 dark:bg-black/30">
          <Search className="w-5 h-5 text-gray-400 dark:text-blue-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type to search commands, projects, or actions..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-base bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none dark:text-gray-200 dark:placeholder-gray-500"
          />
          <button
            onClick={() => setOpen(false)}
            className="px-2 py-1 text-xs text-gray-500 transition-colors border border-gray-300 rounded-md hover:bg-gray-100 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            ⌘K
          </button>
        </div>

        {/* Results Section */}
        <div className="p-3 overflow-y-auto max-h-96 bg-gray-50/50 dark:bg-gradient-to-b dark:from-[#0f0f0f] dark:to-[#1a1a1a]">
          {/* You can map over actual search results here */}
          <div className="p-4 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl dark:bg-[#141414]/60 dark:border-gray-800 dark:text-gray-400">
            Start typing to see results...
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-3 border-t border-gray-200 bg-gray-50/70 dark:border-gray-800/80 dark:bg-black/20">
          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 transition-all duration-200 bg-blue-100 rounded-lg hover:bg-blue-200 dark:text-blue-400 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 dark:hover:text-blue-300"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
