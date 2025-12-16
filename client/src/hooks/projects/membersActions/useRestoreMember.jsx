import { useState, useContext } from "react";
import axios from "axios";
import { ProjectContext } from "../../../context/project/ProjectContext";

export const useRestoreMember = () => {
  const { project, setProject } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const restoreMember = async (memberId) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/api/projects/${project._id}/members/restore`,
        { memberId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Backend returns the restored member
      const restoredMember = res.data.restoredMember;

      // Update project context to reflect changes
      const updatedProject = {
        ...project,
        removedMembers: project.removedMembers.filter((m) => m._id !== memberId),
        teamMembers: [...(project.teamMembers || []), restoredMember],
      };
      setProject(updatedProject);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { restoreMember, loading, error };
};
