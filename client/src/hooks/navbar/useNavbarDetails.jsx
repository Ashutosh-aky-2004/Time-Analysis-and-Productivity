import { useEffect, useState } from "react";
import axios from "axios";

const useNavbarDetails = () => {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
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

        if (res.status === 200) {
          setDetails(res.data.data);
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  return { loading, details };
};

export default useNavbarDetails;
