import React from "react";

// --- Skeleton Loader Components ---

const RecommendationCardSkeleton = () => (
  <div className="p-6 transition-all border rounded-2xl bg-white border-neutral-200/80 dark:bg-[#0e1013] dark:border-[#30363d]">
    <div className="h-3 w-1/4 mb-3 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
    <div className="h-5 w-3/4 mb-3 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
    <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
  </div>
);

const StreakTrackerSkeleton = () => (
  <div className="p-6 border rounded-2xl bg-white border-neutral-200/80 dark:bg-[#0e1013] dark:border-[#30363d]">
    <div className="h-6 w-1/3 mb-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="flex-1 space-y-2">
        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
    <div className="flex items-center justify-between mt-5">
      {Array(7)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"
          ></div>
        ))}
    </div>
  </div>
);

// Add the 'export' keyword so you can import this in other files
export const LearnPageSkeleton = () => (
  <div className="text-neutral-800 dark:text-neutral-300">
    <div className="mx-auto max-w-7xl ">
      <header className="mb-12">
        <div className="h-12 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="mt-3 h-6 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </header>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        <main className="space-y-12 lg:col-span-2">
          <section>
            <div className="flex mb-6 h-10 border-b border-neutral-200 dark:border-gray-700">
              <div className="h-full w-28 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>

            <div className="p-8 border rounded-2xl bg-white dark:bg-[#0e1013] border-neutral-200/80 dark:border-[#30363d]">
              <div className="h-8 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="mt-2 mb-8 h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-2 w-full mb-6 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-12 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </section>

          <section>
            <div className="h-8 w-1/3 mb-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <RecommendationCardSkeleton />
              <RecommendationCardSkeleton />
            </div>
          </section>
        </main>

        <aside className="space-y-8 lg:sticky lg:top-24">
          <StreakTrackerSkeleton />
          <div className="p-6 border rounded-2xl bg-white dark:bg-[#0e1013] border-neutral-200/80 dark:border-[#30363d]">
            <div className="h-6 w-1/3 mb-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-2">
              <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
);