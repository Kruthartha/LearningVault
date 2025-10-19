import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
const CodeEditor = ({
  value,
  onChange,
  readOnly = false,
  height = "500px",
}) => {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("nightOwl", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "keyword", foreground: "C792EA", fontStyle: "italic" }, // Soft purple — stylish but readable
          { token: "number", foreground: "F78C6C" }, // Warm orange — contrasts well with dark bg
          { token: "string", foreground: "A5D6FF" }, // Cool blue tone — subtle glow effect
          { token: "comment", foreground: "5C6370", fontStyle: "italic" }, // Muted gray — doesn’t distract
          { token: "type", foreground: "82AAFF" }, // Deep blue — professional
          { token: "constant", foreground: "FF6E6E" }, // Slightly redder — highlights constants
          { token: "function", foreground: "7EE787" }, // Soft green — pops elegantly
          { token: "variable", foreground: "E2B86B" }, // Golden hue — warm touch for identifiers
          { token: "class", foreground: "FFD580" }, // Soft gold — royal and readable
          { token: "tag", foreground: "7FDBCA" }, // Mint cyan — calm contrast for HTML/XML
          { token: "attribute.name", foreground: "80CBC4" }, // Teal — modern and elegant
          { token: "attribute.value", foreground: "A5D6FF" }, // Matches strings for harmony
          { token: "operator", foreground: "F2A6F7" }, // Soft pink-magenta — feels high-tech
        ],
        colors: {
          "editor.background": "#0E1117",
          "editor.foreground": "#E6EDF3",
          "editorCursor.foreground": "#58A6FF",
          "editor.lineHighlightBackground": "#161B22",
          "editorLineNumber.foreground": "#637777",
          "editorLineNumber.activeForeground": "#82aaff",
          "editor.selectionBackground": "#264F78",
          "editor.inactiveSelectionBackground": "#7e57c240",
          "editorIndentGuide.background": "#ffffff20",
          "editorIndentGuide.activeBackground": "#82aaff",
        },
      });

      monaco.editor.setTheme("nightOwl");
    }
  }, [monaco]);

  return (
    <Editor
      height={height} // 👈 dynamic height
      defaultLanguage="javascript"
      value={value}
      onChange={readOnly ? undefined : (newValue) => onChange(newValue ?? "")}
      theme="nightOwl"
      options={{
        fontFamily: "'Fira Code', monospace",
        fontSize: 13,
        minimap: { enabled: false },
        readOnly,
        quickSuggestions: false,
        suggestOnTriggerCharacters: false,
        parameterHints: { enabled: false },
        wordBasedSuggestions: false,
        inlineSuggest: { enabled: false },
      }}
    />
  );
};

export default CodeEditor;
