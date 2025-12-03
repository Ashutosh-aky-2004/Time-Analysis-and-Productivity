import React from "react";
import FilterBar from "./projectDisplay/FilterBar";
import ProjectCards from "./projectDisplay/ProjectCards";
import { useProjects } from "./../../hooks/projects/useProjects";


const LandingPageProject = () => {
  const { projects, loading, error } = useProjects();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && <p>Loading projects...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <>
            <FilterBar projects={projects} />
            <ProjectCards projects={projects} />
          </>
        )}
      </main>
    </div>
  );
};

export default LandingPageProject;
