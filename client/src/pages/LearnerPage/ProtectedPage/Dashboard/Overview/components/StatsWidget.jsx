import React from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Award, Clock, Flame, Star } from "lucide-react";

// Helper Component: Animates numbers counting up
const AnimatedValue = ({ value }) => {
  // We only animate the numeric part
  const numericValue = parseInt(value) || 0;
  const suffix = String(value).replace(String(numericValue), "").trim();

  const spring = useSpring(0, { mass: 0.8, stiffness: 100, damping: 20 });

  React.useEffect(() => {
    spring.set(numericValue);
  }, [spring, numericValue]);

  const display = useTransform(spring, (current) => Math.floor(current));

  return (
    <>
      <motion.span>{display}</motion.span>
      {suffix && <span> {suffix}</span>}
    </>
  );
};

// --- Redesigned & Themed StatCard Component ---
const StatCard = ({ icon: Icon, value, label, colorClass, variants }) => {
  const colorStyles = {
    orange: {
      bg: "dark:bg-black/10",
      icon: "text-orange-500 dark:text-orange-400",
      sparkline: "text-orange-500/20 dark:text-orange-400/10",
    },
    purple: {
      bg: "dark:bg-black/10",
      icon: "text-purple-500 dark:text-purple-400",
      sparkline: "text-purple-500/20 dark:text-purple-400/10",
    },
    red: {
      bg: "dark:bg-black/10",
      icon: "text-red-500 dark:text-red-400",
      sparkline: "text-red-500/20 dark:text-red-400/10",
    },
    green: {
      bg: "dark:bg-black/10",
      icon: "text-green-500 dark:text-green-400",
      sparkline: "text-green-500/20 dark:text-green-400/10",
    },
  };

  const styles = colorStyles[colorClass];

  return (
    <motion.div
      variants={variants}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all dark:border-[#30363d] dark:bg-[#161b22] ${styles.bg}`}
    >
      {/* Decorative Sparkline */}
      <svg
        className={`absolute bottom-0 left-0 w-full h-1/2 ${styles.sparkline}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 162 50"
      >
        <path
          stroke="currentColor"
          strokeWidth="2"
          d="M1 49L20.25 24L39.5 36.5L58.75 11.5L78 29L97.25 1L116.5 24L135.75 11.5L161 49"
        />
      </svg>

      <div className="relative">
        <div
          className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/50 dark:bg-black/20 ${styles.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-sm font-light text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          {/* --- MODIFICATION ---
            If the label is "This Week", we render the formatted string (e.g., "1h 30m") directly.
            Otherwise, we use the AnimatedValue component for counting up.
          */}
          {label === "This Week" ? value : <AnimatedValue value={value} />}
        </p>
      </div>
    </motion.div>
  );
};

// --- [NEW] Helper function to format time ---
/**
 * Formats decimal hours into a human-readable string (e.g., "1h 30m" or "16m")
 * @param {number} decimalHours - The hours value (e.g., 0.2666)
 * @returns {string} - The formatted string
 */
const formatTime = (decimalHours) => {
  if (decimalHours === undefined || decimalHours === null) {
    return "0m";
  }

  // Convert decimal hours to total minutes (e.g., 0.2666... * 60 = 16)
  const totalMinutes = Math.round(decimalHours * 60);

  if (totalMinutes === 0) {
    return "0m";
  }

  // Get the whole hours (e.g., 150 / 60 = 2)
  const hours = Math.floor(totalMinutes / 60);
  // Get the remaining minutes (e.g., 150 % 60 = 30)
  const minutes = totalMinutes % 60;

  const parts = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }

  // Join the parts: "2h 30m", "2h", or "30m"
  return parts.length > 0 ? parts.join(" ") : "0m";
};

// --- Main StatsWidget Component ---
const StatsWidget = ({ stats }) => {
  // --- [MODIFIED] ---
  // Call the new formatTime function to get the human-readable string
  const formattedTime = formatTime(stats.hours);

  const statItems = [
    {
      icon: Flame,
      value: `${stats.streak} days`,
      label: "Current Streak",
      colorClass: "orange",
    },
    {
      icon: Award,
      value: stats.skills,
      label: "Skills Unlocked",
      colorClass: "purple",
    },
    {
      icon: Star,
      value: stats.level,
      label: "XP Level",
      colorClass: "red",
    },
    {
      icon: Clock,
      // --- [MODIFIED] ---
      // Use the new formattedTime string instead of the decimal
      value: formattedTime,
      label: "This Week",
      colorClass: "green",
    },
  ];

  // Animation variants for the container and items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {statItems.map((item) => (
        <StatCard key={item.label} {...item} variants={itemVariants} />
      ))}
    </motion.div>
  );
};

export default StatsWidget;
