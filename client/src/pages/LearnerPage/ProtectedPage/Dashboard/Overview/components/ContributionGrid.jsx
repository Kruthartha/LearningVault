import React, { useState, useEffect, useMemo } from "react";
import { ArrowRight, Flame, Zap, BarChart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Data Processing Hook ---
// Extracts complex logic out of the component for cleanliness
const useContributionData = (activityData) => {
  return useMemo(() => {
    const today = new Date();
    const activityMap = new Map(activityData.map(d => [new Date(d.date).toDateString(), d.count]));

    // Generate day cells for the last year
    const days = Array.from({ length: 364 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (363 - i));
      return date;
    });

    // Calculate Stats
    const totalContributions = activityData.reduce((sum, act) => sum + act.count, 0);
    let longestStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;

    // Calculate longest streak
    for (const day of days) {
      if (activityMap.has(day.toDateString())) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Calculate current streak (checking backwards from today)
    if (activityMap.has(today.toDateString())) {
      currentStreak = 1;
      for (let i = 1; i < days.length; i++) {
        const prevDay = new Date(today);
        prevDay.setDate(today.getDate() - i);
        if (activityMap.has(prevDay.toDateString())) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    return { days, activityMap, totalContributions, longestStreak, currentStreak };
  }, [activityData]);
};


// --- Themed Card Container (More Flexible) ---
const CardContainer = ({ title, headerContent, children }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 dark:bg-[#0e1013] dark:border-[#30363d]">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100">{title}</h3>
      {headerContent}
    </div>
    <div>{children}</div>
  </div>
);

// --- Individual Stat Component ---
const StatPill = ({ icon, value, label }) => (
  <div className="flex items-center gap-2">
    {icon}
    <p className="text-sm">
      <span className="font-bold text-slate-800 dark:text-slate-200">{value}</span>
      <span className="text-slate-500 dark:text-slate-400"> {label}</span>
    </p>
  </div>
);


// --- Main ContributionGrid Component ---
const ContributionGrid = ({ activityData }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });
  
  const { days, activityMap, totalContributions, longestStreak, currentStreak } = useContributionData(activityData);

  useEffect(() => {
    // Standard theme detection
    const observer = new MutationObserver(() => setIsDarkMode(document.documentElement.classList.contains('dark')));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  const lightScale = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
  const darkScale = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
  const currentScale = isDarkMode ? darkScale : lightScale;

  const getColor = (count) => {
    if (count > 9) return currentScale[4];
    if (count > 6) return currentScale[3];
    if (count > 3) return currentScale[2];
    if (count > 0) return currentScale[1];
    return currentScale[0];
  };

  const handleMouseEnter = (e, date, count) => {
    setTooltip({
      visible: true,
      content: `${count} activities on ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  const WEEKS_TO_SHOW = 52;
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    for (let i = 0; i < WEEKS_TO_SHOW; i++) {
      const firstDayOfWeek = days[i * 7];
      const month = firstDayOfWeek.getMonth();
      if (month !== lastMonth && i > 0) { // Check i > 0 to avoid label on the very first week
        labels.push({
          label: firstDayOfWeek.toLocaleDateString('en-US', { month: 'short' }),
          weekIndex: i
        });
      }
      lastMonth = month;
    }
    return labels;
  }, [days]);

  return (
    <>
      <AnimatePresence>
        {tooltip.visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.1 }}
            className="fixed z-50 px-3 py-1 text-sm bg-black text-white rounded-md pointer-events-none dark:bg-white dark:text-black"
            style={{ top: tooltip.y + 15, left: tooltip.x + 15 }}
          >
            {tooltip.content}
          </motion.div>
        )}
      </AnimatePresence>

      <CardContainer 
        title="Learning Activity"
        headerContent={
          <div className="flex items-center gap-4">
            <StatPill icon={<BarChart className="w-4 h-4 text-slate-500" />} value={totalContributions.toLocaleString()} label="total" />
            <StatPill icon={<Zap className="w-4 h-4 text-slate-500" />} value={longestStreak} label="best streak" />
            <StatPill icon={<Flame className="w-4 h-4 text-slate-500" />} value={currentStreak} label="current streak" />
          </div>
        }
      >
        <div className="flex gap-3">
          {/* Weekday Labels */}
          <div className="grid grid-rows-7 gap-[3px] mt-6 text-xs text-slate-400 font-light">
            <span className="mt-[-4px]">M</span>
            <span></span>
            <span className="mt-[-2px]">W</span>
            <span></span>
            <span className="mt-[-1px]">F</span>
          </div>
          
          <div className="relative overflow-x-auto pb-2 w-full">
            {/* Month Labels */}
            {monthLabels.map(({ label, weekIndex }) => (
              <div key={weekIndex} className="absolute top-0 text-xs text-slate-500 dark:text-slate-400" style={{ left: `${weekIndex * 14}px`}}>
                {label}
              </div>
            ))}
            
            {/* Contribution Grid */}
            <motion.div 
              className="grid grid-flow-col grid-rows-7 gap-[3px] mt-6"
              variants={{ visible: { transition: { staggerChildren: 0.005 } } }}
              initial="hidden"
              animate="visible"
            >
              {days.map((date, index) => {
                const count = activityMap.get(date.toDateString()) || 0;
                return (
                  <motion.div
                    key={index}
                    className="h-[11px] w-[11px] rounded-sm"
                    style={{ backgroundColor: getColor(count) }}
                    onMouseEnter={(e) => handleMouseEnter(e, date, count)}
                    onMouseLeave={handleMouseLeave}
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                  />
                );
              })}
            </motion.div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex justify-end items-center text-xs text-slate-500 dark:text-slate-400 mt-2">
          <span>Less</span>
          <div className="flex items-center gap-1 mx-2">
            {currentScale.map((color, i) => (
              <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }}></div>
            ))}
          </div>
          <span>More</span>
        </div>
      </CardContainer>
    </>
  );
};

export default ContributionGrid;