import React from "react";

// Base Shimmer Component with generic classes
export const ShimmerBase = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-slate-200 dark:bg-slate-700/50 rounded-md ${className}`}
  ></div>
);

// 1. Shimmer Card - Useful for project cards, task items
export const ShimmerCard = () => (
  <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
    <div className="flex items-center space-x-4">
      <ShimmerBase className="w-12 h-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <ShimmerBase className="h-4 w-3/4" />
        <ShimmerBase className="h-3 w-1/2" />
      </div>
    </div>
    <ShimmerBase className="h-24 w-full rounded-lg" />
    <div className="flex justify-between items-center pt-2">
      <ShimmerBase className="h-8 w-20 rounded-full" />
      <ShimmerBase className="h-4 w-1/4" />
    </div>
  </div>
);

// 2. Shimmer List Item - Useful for tasks, activity logs
export const ShimmerListItem = () => (
  <div className="flex items-center space-x-4 p-3 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
    <ShimmerBase className="w-10 h-10 rounded-lg" />
    <div className="flex-1 space-y-2">
      <ShimmerBase className="h-4 w-1/3" />
      <ShimmerBase className="h-3 w-1/4" />
    </div>
    <ShimmerBase className="h-6 w-16 rounded-md" />
  </div>
);

// 3. Shimmer Table Row - Useful for user tables, data grids
export const ShimmerTableRow = () => (
  <div className="flex items-center space-x-4 py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
    <ShimmerBase className="h-4 w-1/6" />
    <ShimmerBase className="h-4 w-1/4" />
    <ShimmerBase className="h-4 w-1/6" />
    <ShimmerBase className="h-4 w-1/6" />
    <ShimmerBase className="h-8 w-20 rounded-full ml-auto" />
  </div>
);

// 4. Shimmer Chart - Useful for the dashboard analysis charts
export const ShimmerChart = () => (
  <div className="w-full h-64 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-end justify-between space-x-2">
    {[...Array(7)].map((_, i) => (
      <ShimmerBase
        key={i}
        className="w-full rounded-t-lg"
        style={{ height: `${Math.random() * 60 + 20}%` }}
      />
    ))}
  </div>
);

// 5. Hero / Profile Shimmer
export const ShimmerProfile = () => (
  <div className="flex flex-col items-center space-y-4">
    <ShimmerBase className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-lg" />
    <ShimmerBase className="h-6 w-48" />
    <ShimmerBase className="h-4 w-64" />
    <div className="flex space-x-4 pt-4">
      <ShimmerBase className="h-10 w-28 rounded-lg" />
      <ShimmerBase className="h-10 w-28 rounded-lg" />
    </div>
  </div>
);
