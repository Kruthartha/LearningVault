import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  useRef,
  lazy,
  Suspense, // <-- Added lazy/Suspense from your previous version
} from "react";
import { useNavigate, useParams } from "react-router-dom";
// import ReactMarkdown from "react-markdown"; // Lazy loaded
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  Braces,
  BookOpen,
  GitBranch,
  CodeXml,
  Settings2,
  CheckCircle,
  Check,
  Clock,
  ChevronLeft,
  ChevronRight,
  XCircle,
  Lightbulb,
  X,
  Code,
  HelpCircle,
  Play,
  Zap,
  Clipboard,
} from "lucide-react";

// import CodeBlock from "../components/CodeBlock"; // Lazy loaded
import { LayoutContext } from "../../../Context/LayoutContext";
// import CompletionScreen from "../components/CompletionScreen"; // Lazy loaded

// --- LAZY-LOADED COMPONENTS ---
// (From your previous file structure)
const CodeBlock = lazy(() => import("../components/CodeBlock"));
const CompletionScreen = lazy(() => import("../components/CompletionScreen"));
const ReactMarkdown = lazy(() => import("react-markdown"));

const API_URL = import.meta.env.VITE_API_URL;

// --- FALLBACKS FOR LAZY COMPONENTS ---
// (From your previous file structure)
const MarkdownFallback = () => (
  <div className="space-y-3 p-2">
    <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
  </div>
);

const CodeBlockFallback = () => (
  <div className="min-h-[100px] animate-pulse rounded-lg bg-black p-4">
    <div className="h-4 w-3/4 rounded bg-slate-700"></div>
    <div className="mt-2 h-4 w-1/2 rounded bg-slate-700"></div>
  </div>
);

const FullPageLoader = ({ text = "Loading..." }) => (
  <div className="flex h-screen items-center justify-center dark:bg-[#0d1117]">
    <p className="text-xl text-gray-600 dark:text-gray-300">{text}</p>
  </div>
);

// --- SKELETON LOADER FOR THE PAGE ---

const LessonPageSkeleton = () => (
  <div className="flex min-h-screen animate-pulse flex-col bg-gray-50 dark:bg-[#0d1117]">
    {/* Header Skeleton */}
    <header className="sticky top-0 z-10 w-full border-b border-gray-100 bg-white dark:border-[#30363d] dark:bg-[#161b22]">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4 md:p-6">
        {/* X Button */}
        <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
        {/* Progress Area */}
        <div className="mx-6 flex-1">
          <div className="mb-3 flex items-center gap-4">
            <div className="h-6 w-1/2 rounded-md bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-16 rounded-md bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-16 rounded-md bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="mb-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        {/* Hint Button */}
        <div className="h-10 w-24 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </header>

    {/* Main Content Skeleton */}
    <main className="flex w-full flex-1 flex-col items-center">
      <div className="flex w-full max-w-4xl flex-1 flex-col justify-between">
        <div className="px-4 py-8 md:py-12">
          {/* Heading Block Skeleton */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
              <div className="w-full space-y-2">
                <div className="h-4 w-24 rounded-md bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-8 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
          {/* Text Block Skeleton */}
          <div className="space-y-3">
            <div className="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-5/6 rounded-md bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </main>

    {/* Footer Skeleton */}
    <footer className="sticky bottom-0 w-full border-t border-gray-100 bg-white dark:border-[#30363d] dark:bg-[#161b22]">
      <div className="mx-auto max-w-6xl p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div className="h-12 w-32 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-12 w-36 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </footer>
  </div>
);

// --- Themed Markdown Components ---
const markdownComponents = {
  // ... (no changes)
  code: ({ node, inline, className, children, ...props }) => {
    if (inline) {
      return (
        <code
          className="rounded-md bg-blue-50 px-1.5 py-1 text-sm font-normal text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
          {...props}
        >
          {children}
        </code>
      );
    }
    return <code {...props}>{children}</code>;
  },
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300">
      {children}
    </th>
  ),
  tr: ({ children }) => (
    <tr className="border-b border-gray-200 odd:bg-gray-50 even:bg-white dark:border-gray-800 dark:odd:bg-[#161b22] dark:even:bg-[#0d1117]">
      {children}
    </tr>
  ),
  td: ({ children }) => (
    <td className="border border-gray-300 px-4 py-2 text-sm dark:border-gray-700">
      {children}
    </td>
  ),
  ul: ({ children }) => (
    <ul className="ml-5 list-disc list-outside">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="ml-5 list-decimal list-outside">{children}</ol>
  ),
};

// --- Themed Step Renderer ---
const StepRenderer = ({ step, state, callbacks }) => {
  // ... (no changes to this component)
  const { selectedAnswer, checkStatus, userCode } = state;
  const { setSelectedAnswer, setUserCode } = callbacks;
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (step.code) {
      navigator.clipboard.writeText(step.code.trim());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  switch (step.type) {
    case "heading":
      return (
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="mb-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                Reading
              </div>
              <h1 className="text-2xl font-light text-black dark:text-white md:text-3xl">
                {step.title}
              </h1>
            </div>
          </div>
        </div>
      );

    case "text":
      return (
        <div className="mb-6 max-w-none font-light leading-relaxed dark:text-gray-300">
          <Suspense fallback={<MarkdownFallback />}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={markdownComponents}
            >
              {step.content}
            </ReactMarkdown>
          </Suspense>
        </div>
      );

    case "key_takeaway":
      return (
        <div className="my-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/40 dark:bg-blue-950/20">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/20">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="mb-2 font-medium text-blue-900 dark:text-blue-300">
                Key Takeaway
              </h3>
              <div className="text-sm font-light text-blue-800 dark:text-blue-300">
                <Suspense fallback={<MarkdownFallback />}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={markdownComponents}
                  >
                    {step.content}
                  </ReactMarkdown>
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      );

    case "code":
      return (
        <div className="mb-8">
          {/* Main Container: 
        - bg-black for the "all black" look.
        - border-neutral-800 adds a very subtle border so it doesn't
          disappear on a black website background.
      */}
          <div className="overflow-hidden rounded-lg border border-neutral-800 bg-black shadow-lg">
            {/* Header Bar: 
          - Also bg-black, with a border-b to separate it from the code.
        */}
            <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
              {/* Left Side: Language Name */}
              <div>
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-neutral-500">
                  {step.lang || "javascript"}
                </span>
              </div>

              {/* Right Side: Copy Button */}
              <div>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium transition-colors duration-100 ${
                    isCopied
                      ? "text-blue-300" // "Copied" feedback
                      : "text-neutral-400 hover:text-white" // Default state
                  }`}
                >
                  {isCopied ? <Check size={16} /> : <Clipboard size={16} />}
                  <span className="hidden sm:inline">
                    {isCopied ? "Copied!" : "Copy"}
                  </span>
                </button>
              </div>
            </div>

            {/* Code Area: 
          - This area will be black because of the parent's `bg-black`.
          - Your <CodeBlock> component MUST NOT have its own background color.
        */}
            <Suspense fallback={<CodeBlockFallback />}>
              <CodeBlock
                code={step.code?.trim() || ""}
                language={step.lang || "javascript"}
              />
            </Suspense>
          </div>
        </div>
      );
    case "quiz":
      return (
        <div className="mb-8">
          <div className="mb-8 flex items-center gap-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="mb-1 text-sm font-medium text-orange-600 dark:text-orange-400">
                Quiz Question
              </div>
              <h2 className="text-2xl font-light text-black dark:text-white md:text-3xl">
                {step.question}
              </h2>
            </div>
          </div>
          <div className="space-y-4">
            {step.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === step.correctAnswer;
              let c =
                "border-gray-200 hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-600 dark:hover:bg-blue-500/10";

              // --- THIS IS THE MODIFIED LOGIC ---
              if (checkStatus !== "unchecked") {
                // Check if this option is the one the user selected
                if (isSelected) {
                  // If it's selected, check if it's correct or not
                  if (isCorrect) {
                    // Selected and correct: GREEN
                    c =
                      "border-green-300 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-500/10 dark:text-green-300";
                  } else {
                    // Selected and wrong: RED
                    c =
                      "border-red-300 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-500/10 dark:text-red-300";
                  }
                } else {
                  // This option was NOT selected, so just fade it out.
                  // This prevents the correct answer from being revealed.
                  c = "border-gray-200 opacity-60 dark:border-gray-800";
                }
              } else if (isSelected) {
                // This is the "active" state before checking
                c =
                  "border-blue-300 bg-blue-50 ring-2 ring-blue-100 dark:border-blue-500 dark:bg-blue-500/10 dark:ring-blue-900";
              }
              // --- END OF MODIFIED LOGIC ---

              return (
                <button
                  key={option}
                  onClick={() => setSelectedAnswer(option)}
                  disabled={checkStatus !== "unchecked"}
                  className={`flex w-full items-center justify-between rounded-2xl border-2 p-6 text-left shadow-sm transition-all duration-200 ${c}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-base font-light dark:text-gray-200">
                      {option}
                    </span>
                  </div>
                  {/* This icon logic is correct and doesn't need to change.
                  It only shows the Check if the status is "correct"
                  (which only happens if they selected the right answer) */}
                  {checkStatus === "correct" && isCorrect && (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  )}
                  {/* This only shows the X on the selected wrong answer */}
                  {checkStatus !== "unchecked" && isSelected && !isCorrect && (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      );

    case "image":
      return (
        <div className="my-8 flex justify-center">
          <figure className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-white p-2 shadow-sm dark:border-[#30363d] dark:bg-[#161b22]">
            <img
              src={step.src}
              alt={step.alt || "Lesson image"}
              className="h-auto w-full rounded-xl object-cover"
            />
            {step.caption && (
              <figcaption className="mt-3 px-2 pb-1 text-center text-sm font-light text-gray-600 dark:text-gray-400">
                {step.caption}
              </figcaption>
            )}
          </figure>
        </div>
      );

    default:
      return null;
  }
};

// --- Main Page Component (Themed) ---
export default function LessonPage() {
  const { pathSlug, courseSlug, lessonId } = useParams();
  const navigate = useNavigate();
  const { setIsFullScreen } = useContext(LayoutContext);

  const [lesson, setLesson] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [checkStatus, setCheckStatus] = useState("unchecked");
  const [timeSpent, setTimeSpent] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [userCode, setUserCode] = useState("");
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const intervalRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false); // <-- For fade-in

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setIsVisible(false); // <-- Reset visibility on new load
      setError(null);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("Authentication required.");
        setIsLoading(false);
        return;
      }

      try {
        const [lessonResponse, courseResponse] = await Promise.all([
          fetch(
            `${API_URL}/user/progress/${pathSlug}/${courseSlug}/${lessonId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          fetch(`${API_URL}/user/progress/${pathSlug}/${courseSlug}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!lessonResponse.ok) throw new Error("Failed to fetch lesson data.");
        if (!courseResponse.ok) throw new Error("Failed to fetch course data.");

        const lessonData = await lessonResponse.json();
        const courseDataPayload = await courseResponse.json();

        setLesson(lessonData);
        setCourseData(courseDataPayload.course);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [pathSlug, courseSlug, lessonId]);

  useEffect(() => {
    setIsLessonCompleted(false);
    setCurrentStepIndex(0);
  }, [lessonId]);

  // Effect for fade-in
  useEffect(() => {
    if (!isLoading) {
      setIsVisible(true);
    }
  }, [isLoading]);

  useEffect(() => {
    setIsFullScreen(true);
    return () => setIsFullScreen(false);
  }, [setIsFullScreen]);

  useEffect(() => {
    const startTime = Date.now();
    intervalRef.current = setInterval(
      () => setTimeSpent(Math.floor((Date.now() - startTime) / 1000)),
      1000
    );
    return () => clearInterval(intervalRef.current);
  }, [lessonId]);

  const currentPageBlocks = useMemo(
    () => lesson?.steps[currentStepIndex],
    [lesson, currentStepIndex]
  );

  const interactiveBlockOnPage = useMemo(
    () =>
      currentPageBlocks?.find(
        (block) => block.type === "quiz" || block.type === "exercise"
      ),
    [currentPageBlocks]
  );

  useEffect(() => {
    if (interactiveBlockOnPage) {
      setUserCode(interactiveBlockOnPage.starterCode || "");
      setSelectedAnswer(null);
    }
    setShowHint(false);
    setCheckStatus("unchecked");
  }, [currentStepIndex, interactiveBlockOnPage]);

  const progressBarWidth = useMemo(() => {
    if (!lesson) {
      return 0;
    }
    const totalSteps = lesson.steps.length;
    if (interactiveBlockOnPage?.type === "quiz" && checkStatus === "correct") {
      return ((currentStepIndex + 1) / totalSteps) * 100;
    }
    if (currentStepIndex === 0) {
      return 8;
    }
    return (currentStepIndex / totalSteps) * 100;
  }, [currentStepIndex, checkStatus, lesson, interactiveBlockOnPage]);

  const isLastPage = lesson
    ? currentStepIndex === lesson.steps.length - 1
    : false;

  const handleCheck = () => {
    if (!interactiveBlockOnPage) return;

    if (interactiveBlockOnPage.type === "quiz") {
      setCheckStatus(
        selectedAnswer === interactiveBlockOnPage.correctAnswer
          ? "correct"
          : "incorrect"
      );
    }
    if (interactiveBlockOnPage.type === "exercise") {
      // NOTE: This is placeholder validation logic
      setCheckStatus(
        userCode.includes("language") && userCode.includes("love")
          ? "correct"
          : "incorrect"
      );
    }
  };

  const handleContinue = () => {
    if (!isLastPage) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      clearInterval(intervalRef.current);
      setIsLessonCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleFinishLesson = () =>
    navigate(`/dashboard/learn/paths/${pathSlug}/courses/${courseSlug}`);

  const formatTime = (seconds) =>
    `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;

  const findNextLesson = () => {
    if (!courseData) return null;
    const allLessons = courseData.modules.flatMap((module) => module.lessons);
    const currentLessonIndex = allLessons.findIndex((l) => l.id === lessonId);
    return allLessons[currentLessonIndex + 1] || null;
  };

  // --- RENDER LOGIC ---

  if (isLoading) {
    return <LessonPageSkeleton />;
  }

  if (error) {
    return (
      <div
        className={`flex h-screen items-center justify-center dark:bg-[#0d1117] transition-opacity duration-500 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!lesson || !currentPageBlocks) {
    return (
      <div
        className={`flex h-screen items-center justify-center dark:bg-[#0d1117] transition-opacity duration-500 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Lesson content not found.
        </p>
      </div>
    );
  }

  if (isLessonCompleted) {
    return (
      <div
        className={`transition-opacity duration-500 ease-in-out ${
          // This will be visible immediately as !isLoading is already true
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <Suspense fallback={<FullPageLoader text="Loading Results..." />}>
          <CompletionScreen
            lesson={lesson}
            timeSpent={timeSpent}
            nextLesson={findNextLesson()}
            pathSlug={pathSlug}
            courseSlug={courseSlug}
            onFinish={handleFinishLesson}
          />
        </Suspense>
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-screen flex-col bg-gray-50 dark:bg-[#0d1117] transition-opacity duration-500 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <header className="sticky top-0 z-10 w-full border-b border-gray-100 bg-white dark:border-[#30363d] dark:bg-[#161b22]">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4 md:p-6">
          <button
            onClick={handleFinishLesson}
            className="rounded-xl p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
          <div className="mx-6 flex-1">
            <div className="mb-3 flex items-center gap-4">
              <h1 className="text-lg font-medium text-black dark:text-white">
                {lesson.title}
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentStepIndex + 1} of {lesson.steps.length}
              </span>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeSpent)}</span>
              </div>
            </div>
            <div className="mb-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                style={{ width: `${progressBarWidth}%` }}
              ></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {interactiveBlockOnPage?.hint && (
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
              >
                <Lightbulb className="h-5 w-5" />
                <span className="font-medium">Hint</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex w-full flex-1 flex-col items-center">
        <div className="flex w-full max-w-4xl flex-1 flex-col justify-between">
          <div className="px-4 py-8 md:py-12">
            {currentPageBlocks.map((stepBlock, index) => (
              <StepRenderer
                key={index}
                step={stepBlock}
                state={{ selectedAnswer, checkStatus, userCode }}
                callbacks={{ setSelectedAnswer, setUserCode }}
              />
            ))}
            {showHint && interactiveBlockOnPage?.hint && (
              <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900/50 dark:bg-yellow-500/10">
                <div className="flex items-start gap-3">
                  <Lightbulb className="mt-1 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <h3 className="mb-2 font-medium text-yellow-900 dark:text-yellow-300">
                      Hint
                    </h3>
                    <p className="text-sm font-light text-yellow-800 dark:text-yellow-300">
                      {interactiveBlockOnPage.hint}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer
        className={`sticky bottom-0 w-full transition-all duration-300 ${
          checkStatus === "correct"
            ? "border-t-2 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-500/10"
            : checkStatus === "incorrect"
            ? "border-t-2 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-500/10"
            : "border-t border-gray-100 bg-white dark:border-[#30363d] dark:bg-[#161b22]"
        }`}
      >
        <div className="mx-auto max-w-6xl p-6 md:p-8">
          {checkStatus === "correct" ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-500/20">
                  <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-medium text-green-800 dark:text-green-300">
                    Excellent work!
                  </h3>
                  <p className="text-sm font-light text-green-700 dark:text-green-400">
                    You've got it right. Let's continue.
                  </p>
                </div>
              </div>
              <button
                onClick={handleContinue}
                className="flex items-center gap-2 rounded-xl bg-green-600 px-8 py-3 font-medium text-white shadow-sm hover:bg-green-700"
              >
                Continue <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          ) : checkStatus === "incorrect" ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-500/20">
                  <XCircle className="h-7 w-7 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-medium text-red-800 dark:text-red-300">
                    Not quite right
                  </h3>
                  <p className="text-sm font-light text-red-700 dark:text-red-400">
                    Take another look and try again.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCheckStatus("unchecked")}
                className="rounded-xl bg-red-600 px-8 py-3 font-medium text-white shadow-sm hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                {currentStepIndex > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="flex items-center gap-2 rounded-xl px-6 py-3 font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    Previous
                  </button>
                )}
              </div>
              <button
                onClick={interactiveBlockOnPage ? handleCheck : handleContinue}
                disabled={
                  interactiveBlockOnPage?.type === "quiz" && !selectedAnswer
                }
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-700"
              >
                {interactiveBlockOnPage
                  ? "Check Answer"
                  : isLastPage
                  ? "Finish Lesson"
                  : "Continue"}
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
