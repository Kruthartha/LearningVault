import React, { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/night-owl.css";

const CodeBlock = ({ code, language = "javascript" }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  // This component now only returns the raw <pre> and <code> block
  return (
    <pre className="p-4 overflow-x-auto text-sm bg-[#011627]">
      <code ref={codeRef} className={`language-${language}`}>
        {code}
      </code>
    </pre>
  );
};

export default CodeBlock;