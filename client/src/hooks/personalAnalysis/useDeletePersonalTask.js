import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useDeletePersonalTask = () => {
  const [loading, setLoading] = useState(false);

  const deleteTask = useCallback(async (taskId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user-tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Task deleted successfully");
      return true;
    } catch (err) {
      console.error("Delete task error:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to delete task";
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteTask, loading };
};

export default useDeletePersonalTask;
