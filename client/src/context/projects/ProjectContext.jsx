// context/ProjectContext.jsx
import React, { createContext, useState, useContext, useMemo } from 'react';

const ProjectContext = createContext();

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Website Redesign",
      description: "Complete redesign of company website with new features and improved user experience. The project includes responsive design, new CMS integration, and performance optimization.",
      startDate: "Apr 1, 2024",
      endDate: "May 15, 2024",
      manager: "John Doe",
      activeMembers: 5,
      suspendedMembers: 1,
      duration: "1,240 mins",
      progress: "in-progress",
      createdAt: new Date('2024-03-15')
    },
    {
      id: 2,
      title: "Mobile App Development",
      description: "Build cross-platform mobile application for iOS and Android using React Native. Includes user authentication, payment integration, and push notifications.",
      startDate: "Mar 15, 2024",
      endDate: "Jun 30, 2024",
      manager: "Alice Johnson",
      activeMembers: 3,
      suspendedMembers: 0,
      duration: "850 mins",
      progress: "in-progress",
      createdAt: new Date('2024-02-20')
    },
    {
      id: 3,
      title: "API Migration",
      description: "Migrate legacy APIs to microservices architecture. Improve performance and scalability while maintaining backward compatibility.",
      startDate: "Jan 10, 2024",
      endDate: "Feb 28, 2024",
      manager: "Bob Smith",
      activeMembers: 4,
      suspendedMembers: 0,
      duration: "2,100 mins",
      progress: "completed",
      createdAt: new Date('2023-12-01')
    }
  ]);

  const [filters, setFilters] = useState({
    sortBy: 'newest',
    status: 'all',
    search: ''
  });

  const addProject = (project) => {
    const newProject = {
      ...project,
      id: projects.length + 1,
      createdAt: new Date()
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id, updatedData) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, ...updatedData } : project
    ));
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(project =>
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.manager.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status !== 'all') {
      result = result.filter(project => project.progress === filters.status);
    }

    result.sort((a, b) => {
      switch(filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'duration':
          return parseInt(b.duration.replace(',', '')) - parseInt(a.duration.replace(',', ''));
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [projects, filters]);

  const value = {
    projects,
    filteredProjects,
    filters,
    setFilters,
    addProject,
    updateProject,
    deleteProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};