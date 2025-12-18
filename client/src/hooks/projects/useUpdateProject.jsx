import { useState, useContext } from "react";
import axios from "axios";
import { ProjectContext } from "../../context/project/ProjectContext";

export const useUpdateProject = () => {
  const { setProject } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const updateProject = async (projectId, projectData) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/api/projects/update-project/${projectId}`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setProject(res.data.project); // Update context with full populated project
        return res.data.project;
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update project");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProject, loading, error };
};
