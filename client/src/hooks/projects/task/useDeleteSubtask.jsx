import { useState, useContext } from "react";
import axios from "axios";
import { ProjectContext } from "../../../context/project/ProjectContext";

export const useDeleteSubtask = () => {
  const { setProject } = useContext(ProjectContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteSubtask = async (taskId, subtaskId) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const res = await axios.delete(
        `${API_URL}/api/tasks/${taskId}/subtasks/${subtaskId}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const updatedParentTask = res.data?.data?.task;

      if (!updatedParentTask) return;

      // Update context
      setProject((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          tasks: prev.tasks.map((task) => {
            if (task._id === taskId) {
              return {
                ...task,
                subtasks: updatedParentTask.subtasks, // Use updated subtasks from server
                estimatedHours: updatedParentTask.estimatedHours, // Could change if deleted subtask had hours
                loggedHours: updatedParentTask.loggedHours, // Could change if deleted subtask had hours
                status: updatedParentTask.status, // Could change based on remaining subtasks
              };
            }
            return task;
          }),
        };
      });

      return updatedParentTask;
    } catch (err) {
      console.error("Delete subtask error:", err);
      setError(err.response?.data?.message || "Failed to delete subtask");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteSubtask,
    loading,
    error,
  };
};
