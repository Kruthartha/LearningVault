import React, { useEffect, useRef, useState } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.min.css";

// --- Main Component ---
const CodeBlock = ({ code, language = "javascript" }) => {
  const codeRef = useRef(null);
  // State to manage the fade-in after highlighting
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    // Reset visibility when code changes
    setIsHighlighted(false);

    if (codeRef.current && code) {
      // Run the highlighting
      hljs.highlightElement(codeRef.current);

      // Set to visible after highlighting is done
      // This small delay ensures the fade-in transition works
      const timer = setTimeout(() => {
        setIsHighlighted(true);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [code, language]);

  // If no code is provided, render the skeleton
  if (!code) {
    return (
      <pre className="overflow-x-auto text-sm bg-[#011627]">
        Failed to fetch the Code
      </pre>
    );
  }

  // Render the real code, but keep it invisible until highlighted
  return (
    <pre
      className={`p-4 overflow-x-auto text-sm bg-[#0E1116] transition-opacity duration-300 ease-in-out ${
        isHighlighted ? "opacity-100" : "opacity-0"
      }`}
    >
      <code ref={codeRef} className={`language-${language}`}>
        {code}
      </code>
    </pre>
  );
};

export default CodeBlock;
