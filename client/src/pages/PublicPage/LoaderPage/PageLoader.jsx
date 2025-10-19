import React, { useState, useEffect } from "react"; // Import React hooks
import { BrainCircuit } from "lucide-react";

// --- NEW: A list of general-purpose messages ---
const loadingMessages = [
  "Connecting to LearningVault servers",
  "Initializing client session",
  "Fetching latest content and data",
  "Loading interface components",
  "Syncing your recent activity",
  "Optimizing performance",
  "Finalizing setup",
  "Almost ready",
  "Welcome to LearningVault",
];
// ---------------------------------------------

/**
 * A "Synaptic Grid" loader (V2)
 *
 * - Now features dynamic, general-purpose loading text.
 * - Suitable for use on any page (Homepage, dashboard, etc.).
 * - Includes accessibility (aria-live) for dynamic text.
 */
const SynapticGridLoader = () => {
  // --- NEW: State and Effect for cycling messages ---
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Set up an interval to cycle messages
    const intervalId = setInterval(() => {
      setMessageIndex(
        (prevIndex) => (prevIndex + 1) % loadingMessages.length
      );
    }, 2500); // Change message every 2.5 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  // --------------------------------------------------

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* 1. BACKGROUND */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      {/* 2. CONTENT */}
      <div className="relative z-10 max-w-md mx-auto px-4 text-center">
        {/* Logo Section */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-black mb-6">
            Learning
            <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-medium">
              Vault
            </span>
          </h1>
        </div>

        {/* 3. ANIMATION */}
        <div className="relative mb-12 h-32 w-32 mx-auto">
          {/* Pulsing Core */}
          <div className="absolute inset-0 bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 rounded-full blur-2xl animate-pulse opacity-50"></div>
          {/* Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center shadow-lg">
              <BrainCircuit className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          {/* Spinning Ring */}
          <div className="absolute inset-2 rounded-full border-2 border-blue-300/50 animate-spin"></div>
        </div>

        {/* --- MODIFIED: Loading Text --- */}
        <div
          className="mb-12"
          aria-live="polite" // Accessibility: Announces text changes
        >
          <h2 className="text-xl md:text-2xl font-light text-black mb-2 h-8">
            {/* Display the current dynamic message */}
            {loadingMessages[messageIndex]}
          </h2>
          <p className="text-gray-600 font-light">
            {/* More general sub-text */}
            Getting things ready for you.
          </p>

          {/* Animated dots (using modern Tailwind) */}
          <div className="flex justify-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:'0.2s']"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:'0.4s']"></div>
          </div>
        </div>
        {/* ----------------------------- */}

        {/* 4. SKELETON */}
        {/* (Empty as in original) */}
      </div>
    </div>
  );
};

export default SynapticGridLoader;