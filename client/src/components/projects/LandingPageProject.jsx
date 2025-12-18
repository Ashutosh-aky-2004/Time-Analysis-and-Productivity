import React, { useState } from "react";
import FilterBar from "./projectDisplay/FilterBar";
import ProjectCards from "./projectDisplay/ProjectCards";
import { useProjects } from "../../hooks/projects/useProjects";
import CreateProjectModal from "./projectDisplay/CreateProjectModal";

const LandingPageProject = () => {
  const { projects, loading, error } = useProjects();
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && <p>Loading projects...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <>
            <FilterBar onCreateProject={() => setOpenModal(true)} />
            <ProjectCards projects={projects} />
          </>
        )}

        <CreateProjectModal
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      </main>
    </div>
  );
};

export default LandingPageProject;
