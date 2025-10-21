import React from "react";

const GenericPageSkeleton = () => (
  <div className="animate-pulse">
    {/* Page Header Skeleton */}
    <div className="mb-8">
      <div className="h-10 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      <div className="mt-3 h-5 w-1/2 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
    </div>

    {/* Main Content Skeleton */}
    <div className="space-y-6">
      {/* Large Content Block */}
      <div className="h-48 w-full rounded-xl bg-gray-200 dark:bg-gray-700"></div>

      {/* Smaller Content Blocks */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="h-32 w-full rounded-xl bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-32 w-full rounded-xl bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  </div>
);

export default GenericPageSkeleton;