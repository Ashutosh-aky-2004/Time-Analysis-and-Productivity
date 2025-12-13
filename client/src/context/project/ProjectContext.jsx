import React, { createContext, useContext } from "react";
import { useParams } from "react-router-dom";
import { useProjectDetails } from "../../hooks/projects/useProjectDetails";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { projectID } = useParams();
  const { project, loading, fetchProjectDetails } = useProjectDetails(projectID);

  return (
    <ProjectContext.Provider value={{ project, loading, fetchProjectDetails }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
};
