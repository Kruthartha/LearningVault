import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function NotFound() {
  const messages = [
    "Oops! This page is floating in zero gravity.",
    "Lost in space — can’t locate this page anywhere!",
    "404: Even the aliens couldn’t find this page.",
    "This page is light-years away from where you expected.",
    "Drifting through the void… page not found.",
    "404: This page was swallowed by a black hole.",
    "You’ve reached the edge of the universe — no page here.",
    "This page has warped into another dimension.",
    "404: Signal lost in deep space.",
    "Mission failed — this star system doesn’t exist.",
  ];

  const [randomMessage, setRandomMessage] = useState("");
  const [countdown, setCountdown] = useState(10);

  // Generate static star positions (avoid glitch)
  const [stars, setStars] = useState([]);
  useEffect(() => {
    const generatedStars = Array.from({ length: 120 }).map(() => ({
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.8 + 0.2,
      yMovement: Math.random() * 10 - 5,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
    }));
    setStars(generatedStars);

    // Pick random message
    setRandomMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  // Countdown + redirect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    if (countdown === 0) window.location.href = "/";

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-black text-white overflow-hidden">
      {/* Starfield */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${star.width}px`,
              height: `${star.height}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
              opacity: star.opacity,
            }}
            animate={{
              y: [0, star.yMovement, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      {/* 404 Text */}
      <motion.h1
        className="text-[8rem] font-extrabold tracking-widest font-sans text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        404
      </motion.h1>

      {/* Random Message */}
      <motion.p
        className="text-xl text-gray-300 mt-2 text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {randomMessage}
      </motion.p>

      {/* Countdown */}
      <motion.p
        className="mt-6 text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Redirecting you to <Link to="/">Home</Link> in {countdown} seconds...
      </motion.p>

      {/* Footer Logo */}
      <motion.footer
        className="absolute bottom-24 md:bottom-6 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        
      </motion.footer>
    </div>
  );
}

export default NotFound;
