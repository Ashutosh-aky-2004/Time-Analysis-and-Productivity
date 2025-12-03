import React from "react";
import FilterBar from "./projectDisplay/FilterBar";
import ProjectCards from "./projectDisplay/ProjectCards";

const LandingPageProject = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FilterBar />
          <ProjectCards />
        </main>
      </div>
    </>
  );
};

export default LandingPageProject;
