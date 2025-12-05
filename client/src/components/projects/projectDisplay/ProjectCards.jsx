import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import ProjectCard from "./ProjectCard";
import { HiOutlineInbox } from "react-icons/hi";

const ProjectCards = () => {
  const projects = useSelector((state) => state.project.projects);
  const filters = useSelector((state) => state.project.filters);
  const currentUserId = useSelector((state) => state.project.currentUserId);

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // 1. Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm) ||
          project.description?.toLowerCase().includes(searchTerm) ||
          (project.tags?.some(tag => 
            tag.toLowerCase().includes(searchTerm)
          )) ||
          // Search in manager names
          (project.managingUserId?.some(manager => 
            manager?.firstName?.toLowerCase().includes(searchTerm) ||
            manager?.lastName?.toLowerCase().includes(searchTerm) ||
            manager?.email?.toLowerCase().includes(searchTerm)
          ))
      );
    }

    // 2. Status filter - UPDATED to match your schema
    if (filters.status !== "all") {
      result = result.filter(
        (project) => project.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // 3. Priority filter - NEW
    if (filters.priority !== "all") {
      result = result.filter(
        (project) => project.priority?.toLowerCase() === filters.priority.toLowerCase()
      );
    }

    // 4. Tag filter (if you implement it)
    if (filters.tag) {
      result = result.filter(
        (project) => project.tags?.includes(filters.tag)
      );
    }

    // 5. Sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "duration":
          return (b.totalDuration || 0) - (a.totalDuration || 0);
        case "name-asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "");
        case "priority":
          // Custom priority order: critical > high > medium > low
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [projects, filters]);

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        <HiOutlineInbox className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          No projects found matching your filters.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredProjects.map((project) => (
        <ProjectCard 
          key={project._id || project.id} 
          project={project} 
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

export default ProjectCards;