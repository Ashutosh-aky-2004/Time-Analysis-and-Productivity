import { useEffect, useState } from "react";
import axios from "axios";

const useGetAllUserListForCreateTaskAssingmentPurpose = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/projects/get-all-users-for-task-list-assingment`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      setUsers(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetchUsers: fetchUsers,
  };
};

export default useGetAllUserListForCreateTaskAssingmentPurpose;
