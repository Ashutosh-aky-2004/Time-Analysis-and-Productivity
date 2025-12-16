import { useState, useContext } from "react";
import axios from "axios";
import { ProjectContext } from "../../../context/project/ProjectContext";

export const useUpdateSubtask = () => {
  const { setProject } = useContext(ProjectContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateSubtask = async (taskId, subtaskId, updates) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${API_URL}/api/tasks/${taskId}/subtasks/${subtaskId}`,
        updates,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      const { subtask: updatedSubtask, task: updatedParentTask } =
        res.data?.data || {};

      if (!updatedSubtask || !updatedParentTask) return;

      // Update context
      setProject((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          tasks: prev.tasks.map((task) => {
            if (task._id === taskId) {
              return {
                ...task,
                // Update specific fields of the parent task that might have changed (e.g. status, estimatedHours)
                status: updatedParentTask.status,
                estimatedHours: updatedParentTask.estimatedHours,
                completionPercentage: updatedParentTask.completionPercentage,
                subtasks: task.subtasks.map((st) =>
                  st._id === subtaskId ? { ...st, ...updatedSubtask } : st
                ),
              };
            }
            return task;
          }),
        };
      });

      return updatedSubtask;
    } catch (err) {
      console.error("Update subtask error:", err);
      setError(err.response?.data?.message || "Failed to update subtask");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateSubtask,
    loading,
    error,
  };
};
