import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useUpdatePersonalTask = () => {
  const [loading, setLoading] = useState(false);

  const updateTask = useCallback(async (taskId, updateData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user-tasks/${taskId}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Task updated successfully");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Update task error:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update task";
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateTask, loading };
};

export default useUpdatePersonalTask;
