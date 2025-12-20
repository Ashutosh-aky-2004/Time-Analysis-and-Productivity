import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    // Debug: Trace fetchUser
    console.log("AuthContext: fetchUser called");
    setLoading(true); // Ensure loading state reflects refresh
    try {
      const token = localStorage.getItem("token");
      console.log(
        "AuthContext: Token from storage:",
        token ? "Exists" : "Null"
      );
      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/navbar/add-details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("AuthContext: fetchUser response status:", res.status);
      if (res.status === 200) {
        console.log("AuthContext: fetchUser success", res.data.data);
        setUser(res.data.data);
        setError(null);
      }
    } catch (err) {
      console.error("AuthContext: Error fetching user details:", err);
      // If 401, maybe clear token? For now just set error.
      setError(err.message);
      setUser(null);
      // Notify user of sync failure for debugging
      // toast.error(`Sync Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (token, userData = null) => {
    console.log(
      "AuthContext: Login called with token:",
      token ? "Yes" : "No",
      "UserData:",
      userData ? "Yes" : "No"
    );
    localStorage.setItem("token", token);

    if (userData) {
      setUser(userData);
      setError(null);
    } else {
      await fetchUser();
    }
  };

  const logout = () => {
    console.log("AuthContext: Logout called");
    localStorage.clear(); // Clear all data as requested
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    fetchUser, // Expose if manual refresh needed
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
