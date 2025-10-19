import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
// --- DELETED ---
// import { problemsData } from "../../../data/problemsData.js";
import { LayoutContext } from "../../../Context/LayoutContext";

import { Allotment } from "allotment";
import "allotment/dist/style.css";

import CodeEditor from "../../Learn/components/CodeEditor.jsx";

import {
  Play,
  Upload,
  Settings,
  ChevronDown,
  CheckCircle,
  X,
  Copy,
  RotateCcw,
  Maximize2,
  Minimize2,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Bookmark,
  Share2,
  ArrowLeft,
  Terminal,
  FileText,
  Lightbulb,
  Users,
  Award,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const EXECUTION_API_URL = `${API_URL}/runtime/execute/`;

// --- Helper Functions (No UI changes) ---
const createTestRunnerCode = (userCode, testCases, functionName) => {
  const testLogic = `
    const results = [];
    for (const testCase of ${JSON.stringify(testCases)}) {
      try {
        const inputArgs = Object.values(testCase.input);
        const startTime = performance.now();
        const result = ${functionName}(...inputArgs);
        const endTime = performance.now();
        const passed = testCase.expected !== undefined 
          ? JSON.stringify(result) === JSON.stringify(testCase.expected) 
          : null;
        results.push({
          id: testCase.id,
          passed: passed,
          input: testCase.input,
          expected: testCase.expected,
          actual: result,
          runtime: (endTime - startTime).toFixed(2) + 'ms'
        });
      } catch (error) {
        results.push({ id: testCase.id, passed: false, input: testCase.input, expected: testCase.expected, actual: error.toString(), runtime: 'N/A' });
      }
    }
    console.log("//<RESULTS_START>");
    console.log(JSON.stringify(results));
    console.log("//<RESULTS_END>");
  `;
  return `${userCode}\n\n${testLogic}`;
};

const ProblemSolver = ({ onProblemComplete }) => {
  const { problemSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isModuleContext = location.state?.context === "module";
  const { setIsFullScreen } = useContext(LayoutContext);

  // --- State for API data, loading, and errors ---
  const [problem, setProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- State Management ---
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [showConsole, setShowConsole] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const consoleRef = useRef(null);
  const [isProblemCompleted, setIsProblemCompleted] = useState(false);
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [customTestCase, setCustomTestCase] = useState({
    nums: "[2,7,11,15]",
    target: "9",
  });

  // --- useEffect Hooks ---
  useEffect(() => {
    setIsFullScreen(true);
    return () => setIsFullScreen(false);
  }, [setIsFullScreen]);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleLogs, testResults]);

  // --- MODIFIED: Data Fetching Hook (with robust error handling) ---
  useEffect(() => {
    const fetchProblem = async () => {
      setIsLoading(true);
      setError(null);
      setProblem(null);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("You must be logged in to view this problem.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/problems/${problemSlug}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              `Failed to fetch problem (status ${response.status})`
          );
        }

        const data = await response.json();

        // --- FIX 1: Use data.problem, not data ---
        if (data && data.problem) {
          setProblem(data.problem);
        } else {
          throw new Error("API response is missing the 'problem' object.");
        }
      } catch (err) {
        // --- FIX 3: Robust catch block ---
        console.error("Full fetch error:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred during fetch.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (problemSlug) {
      fetchProblem();
    } else {
      setError("No problem specified in URL.");
      setIsLoading(false);
    }
  }, [problemSlug]);

  // --- MODIFIED: Set starter code when problem loads ---
  // --- MODIFIED: Set starter code and un-escape newlines ---
  useEffect(() => {
    if (problem && problem.starter_code) {
      // --- FIX: Un-escape the newline characters ---
      const unescapedCode = problem.starter_code.replace(/\\n/g, "\n");
      setCode(unescapedCode);
    } else {
      setCode(""); // Clear code if problem is null or has no starter code
    }
  }, [problem]);

  // --- Handle Loading and Error States ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen dark:bg-[#0d1117]">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen dark:bg-[#0d1117]">
        <p className="text-xl text-red-500 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-screen dark:bg-[#0d1117]">
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Problem not found.
        </p>
      </div>
    );
  }

  // --- Variables dependent on `problem` ---
  const allTabs = [
    { id: "description", label: "Description", icon: FileText },
    { id: "solutions", label: "Solutions", icon: Lightbulb },
    { id: "discussions", label: "Discuss", icon: MessageSquare },
  ];
  const availableTabs = isModuleContext
    ? allTabs.filter((tab) => tab.id === "description")
    : allTabs;
  const languages = [
    { id: "javascript", name: "JavaScript" },
    { id: "python", name: "Python" },
    { id: "java", name: "Java" },
    { id: "cpp", name: "C++" },
    { id: "typescript", name: "TypeScript" },
  ];
  // --- FIX 2: Use test_cases from API ---
  const publicTestCases = problem.test_cases || [];

  // --- getDifficultyColor function (No changes) ---
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-500/10 dark:border-green-500/20";
      case "Medium":
        return "text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-500/10 dark:border-orange-500/20";
      case "Hard":
        return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600";
    }
  };

  const executeCode = async (testsToRun, isSubmission = false) => {
    const setLoading = isSubmission ? setIsSubmitting : setIsRunning;
    setLoading(true);
    setShowConsole(true);
    setConsoleLogs([
      {
        type: "info",
        message: isSubmission
          ? "Submitting against all test cases..."
          : "Executing code...",
      },
    ]);
    setTestResults(null);

    if (!testsToRun || testsToRun.length === 0) {
      setConsoleLogs((prev) => [
        ...prev,
        { type: "error", message: "No test cases to run." },
      ]);
      setLoading(false);
      return;
    }

    // --- MODIFIED: Ensure problem and functionName exist ---
    // Note: Your API doesn't seem to have `functionName`.
    // You may need to add this to your API response.
    // For now, I'll hardcode 'twoSum' as a fallback.
    const functionName = problem.functionName || "twoSum";

    if (!problem || !functionName) {
      setConsoleLogs((prev) => [
        ...prev,
        { type: "error", message: "Problem data is missing 'functionName'." },
      ]);
      setLoading(false);
      return;
    }

    const fullScript = createTestRunnerCode(
      code,
      testsToRun,
      functionName // Use the determined function name
    );
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setConsoleLogs((prev) => [
        ...prev,
        { type: "error", message: "Authentication error: Not logged in." },
      ]);
      setLoading(false);
      return;
    }

    // --- This entire try...catch...finally block is safe. ---
    // It catches its own errors and does not cause an unhandled rejection.
    try {
      const response = await fetch(EXECUTION_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          language: selectedLanguage,
          version: "*",
          files: [{ content: fullScript }],
        }),
      });

      if (!response.ok)
        throw new Error(`API request failed with status ${response.status}`);
      const data = await response.json();
      if (data.run.stderr) throw new Error(data.run.stderr);

      const output = data.run.stdout || "";
      const match = output.match(
        /\/\/<RESULTS_START>\s*([\s\S]*?)\s*\/\/<RESULTS_END>/
      );
      if (!match || !match[1])
        throw new Error(
          "Could not find test results in the output. Your code might have an error or an infinite loop."
        );

      const results = JSON.parse(match[1]);
      setTestResults(results);

      const passedCount = results.filter((r) => r.passed).length;
      const totalCount = results.length;

      if (isSubmission) {
        if (passedCount === totalCount) {
          setConsoleLogs((prev) => [
            ...prev,
            { type: "success", message: "Accepted!" },
            { type: "info", message: `Runtime: ${data.run.wall_time}ms` },
            {
              type: "info",
              message: `Memory: ${(data.run.memory / 1024 / 1024).toFixed(
                2
              )}MB`,
            },
          ]);
          if (onProblemComplete) onProblemComplete(problem.slug);
          if (isModuleContext) setIsProblemCompleted(true);
        } else {
          setConsoleLogs((prev) => [
            ...prev,
            {
              type: "error",
              message: `Submission failed. ${
                totalCount - passedCount
              } test cases failed.`,
            },
          ]);
        }
      } else {
        const message =
          results[0]?.id === "custom"
            ? "Custom test case finished."
            : `${passedCount}/${totalCount} public test cases passed.`;
        setConsoleLogs((prev) => [...prev, { type: "success", message }]);
      }
    } catch (error) {
      setConsoleLogs((prev) => [
        ...prev,
        { type: "error", message: error.message },
      ]);
      setTestResults(
        testsToRun.map((tc) => ({
          ...tc,
          id: tc.id, // Ensure ID is passed
          passed: false,
          actual: "Execution Error",
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  const runCode = () => {
    if (useCustomInput) {
      try {
        const parsedInput = {
          nums: JSON.parse(customTestCase.nums),
          target: JSON.parse(customTestCase.target),
        };
        const customTest = [
          { id: "custom", input: parsedInput, expected: null },
        ]; // Added expected: null
        executeCode(customTest, false);
      } catch (e) {
        setShowConsole(true);
        setConsoleLogs([
          {
            type: "error",
            message: "Invalid custom input. Please use valid JSON format.",
          },
        ]);
      }
    } else {
      executeCode(publicTestCases, false);
    }
  };

  const submitCode = () => {
    // --- MODIFIED: Use test_cases ---
    const allTests = [...(problem?.test_cases || [])];
    executeCode(allTests, true);
  };

  // --- MODIFIED: Use starter_code from API ---
  const resetCode = () => setCode(problem.starter_code || "");
  const copyCode = () => navigator.clipboard.writeText(code);

  // --- THEMED RENDER FUNCTIONS ---
  // (Adding null checks `?.` for safety)

  const renderProblemDescription = () => (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 dark:text-gray-400">
            #{problem.id}
          </span>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {problem.title}
          </h1>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full border ${getDifficultyColor(
              problem.difficulty
            )}`}
          >
            {problem.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-green-600 dark:text-green-500" />
            <span>{problem.likes?.toLocaleString() || 0}</span>
            <ThumbsDown className="w-4 h-4 text-red-500" />
            <span>{problem.dislikes || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{problem.acceptance || 0}% Accepted</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {problem.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md dark:bg-gray-800 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 dark:text-slate-400">
            Companies:
          </span>
          {problem.companies?.slice(0, 3).map((company) => (
            <span
              key={company}
              className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md dark:bg-blue-500/10 dark:text-blue-300"
            >
              {company}
            </span>
          ))}
          {problem.companies?.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md dark:bg-gray-800 dark:text-gray-400">
              +{problem.companies.length - 3} more
            </span>
          )}
        </div>
      </div>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-slate-100 leading-relaxed text-sm">
          {problem.description}
        </p>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Examples
        </h3>
        {problem.examples?.map((example, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-4 space-y-2 dark:bg-gray-800/50"
          >
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              Example {index + 1}:
            </div>
            <div className="font-mono text-sm text:black dark:text-white ">
              <div>
                <span className="text-blue-600 dark:text-blue-400">Input:</span>{" "}
                {example.input}
              </div>
              <div>
                <span className="text-green-600 dark:text-green-400">
                  Output:
                </span>{" "}
                {example.output}
              </div>
              <div className="mt-2 text-gray-600 dark:text-blue-100">
                <span className="font-semibold">Explanation:</span>{" "}
                {example.explanation}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Constraints
        </h3>
        <ul className="space-y-1 text-gray-700 dark:text-gray-300">
          {problem.constraints?.map((constraint) => (
            <li key={constraint} className="flex items-start gap-2">
              <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0 dark:bg-gray-500"></span>
              <span className="font-mono text-sm text-blue-600 bg-gray-100 dark:bg-blue-800/10 dark:text-red-400 rounded-sm">
                {constraint}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* This code is correct. If `problem.follow_up` is missing, null, or "", */}
      {/* this block will correctly render nothing. */}
      {problem.follow_up && (
        <div className="bg-blue-50 rounded-lg p-4 dark:bg-blue-900/20">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0 dark:text-blue-400" />
            <div>
              <div className="font-semibold text-blue-900 mb-1 dark:text-blue-200">
                Follow-up:
              </div>
              <div className="text-blue-800 dark:text-blue-300">
                {problem.follow_up}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSolutions = () => (
    // (No changes in this function)
    <div className="p-6">
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">
          Community Solutions
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Solve the problem first to unlock community solutions
        </p>
        <button
          onClick={submitCode}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Your Solution
        </button>
      </div>
    </div>
  );

  const renderDiscussions = () => (
    // (No changes in this function)
    <div className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Discussions
          </h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            New Discussion
          </button>
        </div>
        <div className="space-y-4">
          {[
            /* Hardcoded discussion data for now */
            {
              title: "Optimal O(n) solution with HashMap",
              replies: 23,
              likes: 156,
              author: "codeMaster",
              time: "2h ago",
            },
          ].map((discussion) => (
            <div
              key={discussion.title}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer dark:border-gray-700 dark:hover:border-gray-600"
            >
              <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-2">
                {discussion.title}
              </h4>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>By {discussion.author}</span>
                <span>{discussion.time}</span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  {discussion.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {discussion.replies} replies
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTestCases = () => (
    // (Using publicTestCases which is now problem.test_cases)
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900 dark:text-gray-100">
          Test Cases
        </h4>
        <label className="flex cursor-pointer items-center">
          <span className="mr-3 text-sm text-gray-600 dark:text-gray-400">
            Use Custom Input
          </span>
          <input
            type="checkbox"
            className="sr-only peer"
            checked={useCustomInput}
            onChange={() => setUseCustomInput(!useCustomInput)}
          />
          <div className="relative h-6 w-10 rounded-full bg-gray-200 after:absolute after:top-[2px] after:start-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 dark:bg-gray-700 dark:peer-focus-visible:ring-offset-slate-900"></div>
        </label>
      </div>

      {useCustomInput ? (
        <>
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                nums
              </label>
              <input
                type="text"
                value={customTestCase.nums}
                onChange={(e) =>
                  setCustomTestCase({ ...customTestCase, nums: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                target
              </label>
              <input
                type="text"
                value={customTestCase.target}
                onChange={(e) =>
                  setCustomTestCase({
                    ...customTestCase,
                    target: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
          </div>
          {testResults
            ?.filter((r) => r.id === "custom")
            .map(
              (
                result,
                index // Filter for custom
              ) => (
                <div
                  key={`custom-${index}`} // Use index for key
                  className="mt-4 border border-blue-200 bg-blue-50 rounded-lg p-3 dark:bg-blue-900/20 dark:border-blue-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Custom Result
                    </span>
                    <span className="text-xs text-blue-500 dark:text-blue-400">
                      {result.runtime}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm font-mono text-gray-800 dark:text-gray-300">
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">
                        Input:
                      </span>{" "}
                      {JSON.stringify(result.input)}
                    </div>
                    <div>
                      <span className="text-green-600 dark:text-green-400">
                        Output:
                      </span>{" "}
                      {JSON.stringify(result.actual)}
                    </div>
                  </div>
                </div>
              )
            )}
        </>
      ) : (
        publicTestCases.map((testCase, index) => {
          const result = testResults?.find((r) => r.id === testCase.id);
          return (
            <div
              key={testCase.id}
              className="border border-gray-200 rounded-lg p-3 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Test Case {index + 1}
                </span>
                {result && (
                  <div className="flex items-center gap-2">
                    {result.passed ? (
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {result.runtime}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2 text-sm font-mono text-gray-800 dark:text-gray-300">
                <div>
                  <span className="text-blue-600 dark:text-blue-400">
                    nums =
                  </span>{" "}
                  {JSON.stringify(testCase.input.nums)}
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-400">
                    target =
                  </span>{" "}
                  {testCase.input.target}
                </div>
                <div>
                  <span className="text-green-600 dark:text-green-400">
                    Expected:
                  </span>{" "}
                  {JSON.stringify(testCase.expected)}
                </div>
                {result && (
                  <div>
                    <span
                      className={`${
                        result.passed
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-500"
                      }`}
                    >
                      Output:
                    </span>{" "}
                    {JSON.stringify(result.actual)}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  if (isProblemCompleted)
    return (
      // (No changes in this block)
      <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117] flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white dark:bg-[#161b22]/10 rounded-3xl shadow-xl p-8 md:p-12 max-w-2xl w-full">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-50 dark:ring-green-500/5">
            <Award className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-light text-gray-800 dark:text-gray-100 mb-4">
            Problem Completed!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-light max-w-md mx-auto mb-10">
            Excellent work on solving "{problem.title}". You can now return to
            the module.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              Return to Module
            </button>
          </div>
        </div>
      </div>
    );

  // --- Main Component JSX ---
  return (
    <div className="h-screen bg-gray-50 dark:bg-[#0d1117] flex flex-col">
      <header className="bg-white dark:bg-[#161b22]/80 border-b border-gray-200 dark:border-[#30363d] sticky top-0 z-50 flex-shrink-0">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-light text-black dark:text-white">
                  Learning
                  <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-medium">
                    Vault
                  </span>
                </h1>
                <span className="text-gray-400 dark:text-gray-700">|</span>
                <span className="text-lg text-gray-700 dark:text-gray-300">
                  {problem.title}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <div
        className={`flex-1 ${
          isFullscreen ? "fixed inset-0 top-[61px] z-40" : "relative"
        }`}
      >
        <Allotment>
          <Allotment.Pane minSize={450} visible={!isFullscreen}>
            <div className="bg-white dark:bg-[#161b22]/10 h-full flex flex-col">
              <div className="border-b border-gray-200 dark:border-[#30363d] flex-shrink-0">
                <nav className="flex">
                  {availableTabs.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === id
                          ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                          : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="flex-1 overflow-y-auto">
                {activeTab === "description" && renderProblemDescription()}
                {activeTab === "solutions" && renderSolutions()}
                {activeTab === "discussions" && renderDiscussions()}
              </div>
            </div>
          </Allotment.Pane>
          <Allotment.Pane>
            <div className="flex flex-col h-full bg-white dark:bg-[#0d1117]">
              <div className="bg-white dark:bg-[#161b22]/10 border-b border-gray-200 dark:border-[#30363d] p-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="appearance-none bg-gray-100 border border-gray-300 text-left rounded-lg pl-4 pr-8 py-2 text-sm font-medium focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                      >
                        {languages.map((lang) => (
                          <option key={lang.id} value={lang.id}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={copyCode}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors dark:text-gray-400 dark:hover:bg-gray-800"
                        title="Copy Code"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={resetCode}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors dark:text-gray-400 dark:hover:bg-gray-800"
                        title="Reset Code"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Font:</span>
                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-700"
                    >
                      <option value={12}>12px</option>
                      <option value={14}>14px</option>
                      <option value={16}>16px</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex-1 relative">
                <Allotment vertical>
                  <Allotment.Pane>
                    <div className="bg-[#011627] h-full w-full">
                      <CodeEditor
                        value={code}
                        onChange={setCode}
                        height="100%"
                        language={selectedLanguage}
                        fontSize={fontSize}
                      />
                    </div>
                  </Allotment.Pane>
                  <Allotment.Pane
                    preferredSize={300}
                    minSize={100}
                    visible={showConsole}
                  >
                    <div className="bg-white dark:bg-[#161b22] h-full flex flex-col">
                      <div className="flex items-center justify-between p-3 border-b border-gray-200 flex-shrink-0 dark:border-[#30363d]">
                        <div className="flex items-center gap-4">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            Console
                          </span>
                          {testResults && !useCustomInput && (
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {testResults.filter((r) => r.passed).length}/
                              {testResults.length} passed
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setShowConsole(false)}
                          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                      <div ref={consoleRef} className="flex-1 overflow-y-auto">
                        {consoleLogs.length > 0 && (
                          <div className="p-4 space-y-1">
                            {consoleLogs.map((log, index) => (
                              <div
                                key={index}
                                className={`text-sm font-mono ${
                                  log.type === "error"
                                    ? "text-red-600 dark:text-red-400"
                                    : log.type === "success"
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-gray-600 dark:text-gray-400"
                                }`}
                              >
                                {log.message}
                              </div>
                            ))}
                          </div>
                        )}
                        {renderTestCases()}
                      </div>
                    </div>
                  </Allotment.Pane>
                </Allotment>
              </div>
              <div className="bg-white dark:bg-[#161b22]/10 border-t border-gray-200 dark:border-[#30363d] p-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={runCode}
                      disabled={isRunning}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {isRunning ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Run
                        </>
                      )}
                    </button>
                    <button
                      onClick={submitCode}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Submit
                        </>
                      )}
                    </button>
                  </div>
                  {!showConsole && (
                    <button
                      onClick={() => setShowConsole(true)}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      <Terminal className="w-4 h-4" />
                      Show Console
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
};

export default ProblemSolver;
