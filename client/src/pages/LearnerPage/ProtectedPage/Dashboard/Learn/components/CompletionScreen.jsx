import React, { useState, useEffect } from "react";
import {
  motion,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Confetti from "react-confetti";
import { NavArrowRight, Xmark, Timer, Star } from "iconoir-react";
import { useNavigate } from "react-router-dom";
import api from "../../../../../../services/api";
// --- 1. IMPORT YOUR AXIOS WRAPPER ---

// --- Reusable Animated Components ---

// --- 2. API_URL CONSTANT REMOVED ---
// The baseURL is now set in your api.js wrapper

const AnimatedStat = ({ value, isTime = false }) => {
  const spring = useSpring(0, { mass: 0.8, stiffness: 100, damping: 15 });
  React.useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  const display = useTransform(spring, (current) =>
    isTime
      ? `${Math.floor(current / 60)}:${(Math.floor(current) % 60)
          .toString()
          .padStart(2, "0")}`
      : `+${Math.floor(current)}`
  );

  return <motion.span>{display}</motion.span>;
};

const AnimatedCheckmarkIcon = () => (
  <motion.div
    variants={itemVariants}
    className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gray-50 to-gray-200 dark:from-zinc-800 dark:to-zinc-900"
  >
    <svg
      className="h-12 w-12"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d="M5 13l4 4L19 7"
        className="stroke-blue-500"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
      />
    </svg>
  </motion.div>
);

const StatItem = ({ icon, label, value, isTime = false }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200/60 dark:bg-zinc-700/50">
        {icon}
      </div>
      <p className="font-medium text-gray-700 dark:text-zinc-300">{label}</p>
    </div>
    <p className="font-semibold text-gray-900 dark:text-white">
      <AnimatedStat value={value} isTime={isTime} />
    </p>
  </div>
);

// --- Framer Motion Animation Variants (Apple-like physics) ---

const cardTransition = { type: "spring", stiffness: 300, damping: 35 };

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...cardTransition, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

// --- Main CompletionScreen Component ---

const CompletionScreen = ({
  lesson = { id: "intro-react", title: "Introduction to React" },
  timeSpent = 245,
  nextLesson = { id: "next-lesson-slug" },
  pathSlug = "react-basics",
  courseSlug = "getting-started",
  onFinish,
}) => {
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = React.useState({ width: 0, height: 0 });

  // --- Side Effects ---
  React.useEffect(() => {
    // API Call to save progress
    const saveProgress = async () => {
      // --- START: REFACTORED API CALL ---
      console.log(`Saving progress for lesson "${lesson.title}"...`);

      try {
        // 1. Construct the relative API URL (no VITE_API_URL needed)
        const apiUrl = `/user/progress/${pathSlug}/${courseSlug}/${lesson.id}/complete`;

        // 2. Make the POST request using the 'api' wrapper.
        //    - 'Authorization' header is added automatically.
        //    - 'Content-Type' is handled automatically.
        //    - JSON.stringify is done automatically.
        const response = await api.post(apiUrl, {
          timeSpent: Math.floor(timeSpent),
        });

        // 3. Success! Axios puts the response body in `response.data`.
        const result = response.data;
        console.log("Progress saved successfully:", result);
      } catch (error) {
        // 4. Handle errors from Axios (non-2xx responses, network errors)
        if (error.response) {
          // The server responded with an error (e.g., 401, 404, 500)
          console.error(
            `Failed to save progress: ${error.response.status}`,
            error.response.data?.message || "Unknown server error"
          );
        } else if (error.request) {
          // The request was made but no response was received
          console.error(
            "No response from server. Network error:",
            error.request
          );
        } else {
          // Something else happened
          console.error(
            "An error occurred while saving progress:",
            error.message
          );
        }
      }
      // --- END: REFACTORED API CALL ---
    };

    saveProgress();

    // Use specific dependencies for the API call
  }, [lesson.id, lesson.title, timeSpent, pathSlug, courseSlug]);

  React.useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize(); // Set initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isCourseComplete = !nextLesson;
  const confettiColors = ["#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"];

  return (
    <div className="font-sans flex min-h-screen w-full items-center justify-center overflow-hidden p-4 bg-gray-100 dark:bg-black">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={isCourseComplete ? 500 : 250}
        recycle={false}
        gravity={0.08}
        colors={confettiColors}
      />

      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,122,255,0.15),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(0,122,255,0.1),transparent_50%)]"></div>

      <AnimatePresence>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-sm rounded-[28px] border border-white/20 dark:border-zinc-700/50 bg-white/70 dark:bg-zinc-800/70 p-6 shadow-2xl shadow-black/10 backdrop-blur-2xl"
        >
          <button
            onClick={onFinish}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
            aria-label="Close"
          >
            <Xmark
              className="text-gray-600 dark:text-zinc-400"
              height={20}
              width={20}
            />
          </button>

          <div className="text-center pt-8">
            <AnimatedCheckmarkIcon />

            <motion.h1
              variants={itemVariants}
              className="mt-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white"
            >
              {isCourseComplete ? "Course Complete" : "Lesson Complete"}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto mt-1 max-w-xs text-gray-500 dark:text-zinc-400"
            >
              {isCourseComplete
                ? "Fantastic work. You've mastered this course."
                : `You finished "${lesson.title}".`}
            </motion.p>
          </div>

          <motion.div
            variants={itemVariants}
            className="my-8 space-y-3 rounded-xl bg-gray-100/80 p-4 dark:bg-zinc-900/50"
          >
            <StatItem
              icon={<Timer className="text-gray-500 dark:text-zinc-400" />}
              label="Time"
              value={timeSpent}
              isTime
            />
            <div className="h-px bg-gray-200 dark:bg-zinc-700/50"></div>
            <StatItem
              icon={<Star className="text-gray-500 dark:text-zinc-400" />}
              label="XP Earned"
              value={150}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            {nextLesson ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  navigate(
                    `/dashboard/learn/paths/${pathSlug}/courses/${courseSlug}/lessons/${nextLesson.id}`
                  )
                }
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 hover:shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Next Lesson
                <NavArrowRight className="transition-transform group-hover:translate-x-1" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onFinish}
                className="w-full rounded-xl bg-gray-200 px-5 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
              >
                Back to Course
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CompletionScreen;
