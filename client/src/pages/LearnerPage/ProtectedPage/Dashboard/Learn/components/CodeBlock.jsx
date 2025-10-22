import React, { useEffect, useRef, useState } from "react";
import hljs from "highlight.js/lib/core"; // ✅ core only

//  Import only the languages you need
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";

import "highlight.js/styles/github-dark.min.css";

// Register only required languages
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("html", html);
hljs.registerLanguage("css", css);

// --- Main Component ---
const CodeBlock = ({ code, language = "javascript" }) => {
  const codeRef = useRef(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    setIsHighlighted(false);

    if (codeRef.current && code) {
      hljs.highlightElement(codeRef.current);

      const timer = setTimeout(() => setIsHighlighted(true), 50);
      return () => clearTimeout(timer);
    }
  }, [code, language]);

  if (!code) {
    return (
      <pre className="overflow-x-auto text-sm bg-[#011627] text-gray-400 p-4 rounded-md">
        Failed to fetch the Code
      </pre>
    );
  }

  return (
    <pre
      className={`p-4 overflow-x-auto text-sm bg-[#0E1116] text-gray-100 rounded-md transition-opacity duration-300 ease-in-out ${
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
