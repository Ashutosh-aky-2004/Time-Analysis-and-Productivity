import { useState } from "react";
import axios from "axios";

export default function useProfileUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);

  const uploadProfilePic = async (file) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token"); 
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/profile/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // attach token
          },
        }
      );
      const uploadedUrl = res.data.url;
      setUrl(res.data.url);
      setLoading(false);
      if (!uploadedUrl) throw new Error("Upload failed");

    // 2. Save the uploaded URL to user's profile in DB
    await axios.put(
      `${import.meta.env.VITE_API_URL}/profile/update-avatar`,
      { avatar: uploadedUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
      return res.data.url;
    } catch (err) {
      console.error(err);
      setError("Upload failed");
      setLoading(false);
      return null;
    }
  };

  return { url, loading, error, uploadProfilePic };
}
