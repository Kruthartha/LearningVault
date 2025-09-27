import { useEffect, useRef } from "react";
import { Search } from "lucide-react";

const CommandPalette = ({ open, setOpen, setSearchTerm }) => {
  const inputRef = useRef(null);
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
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
      className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-20"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-gray-200 ml-5 mr-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search courses, projects, actions..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-base"
          />
          <button
            onClick={() => setOpen(false)}
            className="text-xs text-gray-500 border border-gray-200 rounded-md px-2 py-1"
          >
            ⌘K
          </button>
        </div>
        <div className="p-2 max-h-96 overflow-y-auto">
          <div className="p-2 text-sm text-gray-500">
            Start typing to see results.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
