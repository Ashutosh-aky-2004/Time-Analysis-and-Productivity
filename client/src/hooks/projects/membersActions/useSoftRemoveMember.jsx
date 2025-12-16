import { useState, useContext } from "react";
import axios from "axios";
import { ProjectContext } from "../../../context/project/ProjectContext";

export const useSoftRemoveMember = () => {
  const { project, setProject } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const softRemoveMember = async (memberId) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/api/projects/${project._id}/members/remove`,
        { memberId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Backend returns the removed member
      const removedMember = res.data.removedMember;

      // Update project context to reflect changes
      const updatedProject = {
        ...project,
        teamMembers: project.teamMembers.filter((m) => m._id !== memberId),
        removedMembers: [...(project.removedMembers || []), removedMember],
      };
      setProject(updatedProject);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { softRemoveMember, loading, error };
};
