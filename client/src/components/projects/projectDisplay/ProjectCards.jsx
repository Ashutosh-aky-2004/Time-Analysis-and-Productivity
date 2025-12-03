// components/ProjectCards.jsx
import React from 'react';

import ProjectCard from './ProjectCard';
import { useProjectContext } from '../../../context/projects/ProjectContext';

const ProjectCards = () => {
  const { filteredProjects } = useProjectContext();

  return (
    <div className="space-y-6">
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 dark:text-gray-400">No projects found matching your filters.</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))
      )}
    </div>
  );
};

export default ProjectCards;