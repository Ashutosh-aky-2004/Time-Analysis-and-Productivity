const ProjectDetailsShimmer = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="h-8 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
              <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-4"></div>
            </div>

            {/* Tasks Section */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
              <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-4"></div>
            </div>

            {/* Comments Section */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
              <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              {[1, 2, 3].map((_, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 items-start animate-pulse"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Project Info Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-3">
              <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>

            {/* Team Members Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-3">
              <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              {[1, 2, 3].map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                ></div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-3">
              {[1, 2, 3].map((_, idx) => (
                <div
                  key={idx}
                  className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsShimmer;
