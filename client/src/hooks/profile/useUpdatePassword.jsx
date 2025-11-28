import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export function useUpdatePassword() {
  const [loading, setLoading] = useState(false);

  const updatePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${API_URL}/profile/update-password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Password updated successfully!");
        return true;
      } else {
        toast.error(res.data.message || "Failed to update password");
        return false;
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Server error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updatePassword, loading };
}
