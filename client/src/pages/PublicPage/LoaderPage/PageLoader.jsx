import React from "react";
import { BrainCircuit } from "lucide-react"; // A great icon for this theme

/**
 * A "Synaptic Grid" loader based *directly* on your HomeSection's visual theme.
 *
 * - Uses the exact same background grid and mask from your hero.
 * - Features your branded "LearningVault" logo.
 * - Adds a pulsing "synaptic core" animation.
 * - Includes a skeleton preview of the content cards.
 */
const SynapticGridLoader = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* 1. BACKGROUND: 
        This is the *exact* grid and mask from your HomeSection 
      */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      {/* 2. CONTENT: 
        Sits on top of the grid background 
      */}
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

        {/* 3. ANIMATION: 
          The "Synaptic Core" 
        */}
        <div className="relative mb-12 h-32 w-32 mx-auto">
          {/* Pulsing Gradient Blur (The "Core") */}
          <div className="absolute inset-0 bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 rounded-full blur-2xl animate-pulse opacity-50"></div>

          {/* Icon in the center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center shadow-lg">
              <BrainCircuit className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          {/* Spinning Outer Ring (optional, but adds dynamism) */}
          <div className="absolute inset-2 rounded-full border-2 border-blue-300/50 animate-spin"></div>
        </div>

        {/* Loading Text */}
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-2">
            Calibrating learning pathways...
          </h2>
          <p className="text-gray-600 font-light">
            Please wait while we connect your workspace.
          </p>

          {/* Animated dots */}
          <div className="flex justify-center space-x-2 mt-4">
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>

        {/* 4. SKELETON: 
          A preview of your "Three phases" cards 
        */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
            >
              <div className="animate-pulse">
                <div className="w-12 h-6 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SynapticGridLoader;