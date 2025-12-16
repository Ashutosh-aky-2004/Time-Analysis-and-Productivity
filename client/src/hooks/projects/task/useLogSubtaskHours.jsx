import { useState, useContext } from "react";
import axios from "axios";
import { ProjectContext } from "../../../context/project/ProjectContext";

export const useLogSubtaskHours = () => {
  const { setProject } = useContext(ProjectContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logSubtaskHours = async (taskId, subtaskId, data) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/api/tasks/${taskId}/subtasks/${subtaskId}/time`,
        data,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      const {
        subtask: updatedSubtask,
        task: updatedParentTask,
        timeEntry,
      } = res.data?.data || {};

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
                loggedHours: updatedParentTask.loggedHours,
                status: updatedParentTask.status,
                subtasks: task.subtasks.map((st) =>
                  st._id === subtaskId ? { ...st, ...updatedSubtask } : st
                ),
              };
            }
            return task;
          }),
        };
      });

      return { updatedSubtask, timeEntry };
    } catch (err) {
      console.error("Log subtask hours error:", err);
      setError(err.response?.data?.message || "Failed to log hours");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    logSubtaskHours,
    loading,
    error,
  };
};
