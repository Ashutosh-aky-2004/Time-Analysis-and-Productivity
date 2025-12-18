import React from "react";
import { ShimmerBase, ShimmerCard } from "../../shimmer/Shimmer";

const ProjectDetailsShimmer = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <ShimmerBase className="h-8 w-1/4" />
          <ShimmerBase className="h-6 w-1/2" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
              <ShimmerBase className="h-6 w-1/2" />
              <ShimmerBase className="h-4 w-3/4" />
              <ShimmerBase className="h-4 w-5/6" />
              <ShimmerBase className="h-2 w-full mt-4" />
            </div>

            {/* Tasks Section */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
              <ShimmerBase className="h-6 w-1/4" />
              <ShimmerBase className="h-40 mt-4 bg-gray-100 dark:bg-gray-800/50" />
            </div>

            {/* Detailed task list shimmer */}
            {[1, 2, 3].map((i) => (
              <ShimmerCard key={i} />
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Project Info Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-3">
              <ShimmerBase className="h-6 w-1/2" />
              <ShimmerBase className="h-4 w-full" />
              <ShimmerBase className="h-4 w-5/6" />
            </div>

            {/* Team Members Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-3">
              <ShimmerBase className="h-6 w-1/3" />
              {[1, 2, 3].map((_, idx) => (
                <ShimmerBase key={idx} className="h-12 w-full rouded-lg" />
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-3">
              {[1, 2, 3].map((_, idx) => (
                <ShimmerBase key={idx} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsShimmer;
