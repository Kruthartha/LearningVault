import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const goHome = () => {
    navigate("/");
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient blobs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main content */}
      <div className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center z-10">
          {/* Status badge */}

          {/* Large 404 display */}
          <div className="mb-8 relative">
            <h1 className="text-[12rem] md:text-[16rem] font-ultralight text-gray-100 leading-none tracking-tighter select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl md:text-8xl font-extralight text-black tracking-tight">
                Oops!
              </div>
            </div>
          </div>

          {/* Main message */}
          <h2 className="text-4xl md:text-6xl font-extralight text-black mb-8 tracking-tight leading-tight">
            This page took a
            <br />
            <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-light">
              wrong turn
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-500 font-light mb-16 max-w-2xl mx-auto leading-relaxed">
            The page you're looking for doesn't exist. But don't worry —
            <br className="hidden md:block" />
            your learning journey is still on track.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              onClick={goHome}
              className="inline-flex items-center px-8 py-4 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-900 transition-all duration-300 hover:shadow-2xl hover:scale-105 min-w-[200px]"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
              Go Home
            </button>

            <button
              onClick={goBack}
              className="inline-flex items-center px-8 py-4 bg-white text-slate-800 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300 hover:shadow-xl hover:scale-105 min-w-[200px]"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              Go Back
            </button>
          </div>

          {/* Help text */}
          <p className="text-sm text-gray-400 font-light">
            Still lost? Try searching for what you need or{" "}
            <button className="text-blue-600 hover:text-blue-700 underline font-medium">
              contact our support team
            </button>
          </p>
        </div>
      </div>

      {/* Minimalist quote section */}
      <div className="relative py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <blockquote className="text-3xl md:text-4xl font-extralight text-gray-600 leading-relaxed tracking-wide">
            "Every expert was once a beginner.
            <br className="hidden md:block" />
            Every pro was once an amateur."
          </blockquote>
          <div className="mt-8 w-16 h-px bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
        </div>
      </div>

      {/* Brand footer */}
      <div className="relative py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <h4 className="text-3xl font-light text-black">
              Learning
              <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-medium">
                Vault
              </span>
            </h4>
          </div>
          <p className="text-gray-400 text-sm">
            Learn by building. Succeed by doing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
