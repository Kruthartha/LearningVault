import React from 'react';

// Skeleton for a single stat (Streak, Skills, etc.)
const StatSkeleton = () => (
  <div className="flex-1 p-4 bg-white dark:bg-gray-800 rounded-lg shadow min-w-[120px]">
    <div className="h-4 w-1/2 mb-2 rounded bg-gray-200 dark:bg-gray-700"></div>
    <div className="h-6 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
  </div>
);

// Skeleton for a task or learning path item
const ListItemSkeleton = () => (
  <div className="flex items-center p-3">
    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
    <div className="flex-1 ml-3 space-y-2">
      <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>
  </div>
);

// Skeleton for the main content blocks
const CardSkeleton = ({ children, height = 'h-48' }) => (
  <div className={`p-6 bg-white dark:bg-[#0e1013] border border-neutral-200/80 dark:border-[#30363d] rounded-2xl ${height}`}>
    <div className="h-5 w-1/3 mb-4 rounded bg-gray-200 dark:bg-gray-700"></div>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

export const OverviewPageSkeleton = () => (
  <div className="animate-pulse">
    {/* Header/Welcome */}
    <div className="h-10 w-1/2 mb-6 rounded-lg bg-gray-200 dark:bg-gray-700"></div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Focus Card (with stats) */}
        <div className="p-6 bg-white dark:bg-[#0e1013] border border-neutral-200/80 dark:border-[#30363d] rounded-2xl">
          <div className="h-6 w-3/4 mb-4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-4 w-1/2 mb-6 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex flex-wrap gap-4">
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </div>
        </div>

        {/* Learning Paths */}
        <CardSkeleton height="auto">
          <ListItemSkeleton />
          <ListItemSkeleton />
        </CardSkeleton>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-1 space-y-6">
        {/* Activity Heatmap */}
        <CardSkeleton height="h-64">
           <div className="h-full w-full rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </CardSkeleton>

        {/* Upcoming Tasks */}
        <CardSkeleton height="auto">
          <ListItemSkeleton />
          <ListItemSkeleton />
        </CardSkeleton>
      </div>
    </div>
  </div>
);