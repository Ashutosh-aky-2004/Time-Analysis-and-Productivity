import { useState, useContext } from "react";
import axios from "axios";
import { ProjectContext } from "../../../context/project/ProjectContext";

const useSuspendMember = () => {
  const { project, setProject } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const suspendMember = async (memberId) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/projects/${project._id}/members/suspend`,
        { memberId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local project state: move member from active to suspended
      const updatedTeamMembers = project.teamMembers.filter(
        (m) => m._id !== memberId
      );
      const suspendedMember = project.teamMembers.find(
        (m) => m._id === memberId
      );

      setProject({
        ...project,
        teamMembers: updatedTeamMembers,
        suspendedMembers: [...project.suspendedMembers, suspendedMember],
      });

      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
      throw err;
    }
  };

  return { suspendMember, loading, error };
};

export default useSuspendMember;
