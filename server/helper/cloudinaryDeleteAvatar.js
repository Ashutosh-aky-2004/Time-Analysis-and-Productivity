import cloudinary from "../config/cloudinary.js";

const getPublicIdFromUrl = (url) => {
  
  const parts = url.split("/");
  const versionIndex = parts.findIndex((part) => part.startsWith("v"));
  const publicIdWithExtension = parts.slice(versionIndex + 1).join("/"); // profile_pics/qtnq8icjqlwehxbf4gzd.webp
  return publicIdWithExtension.replace(/\.[^/.]+$/, ""); // remove file extension
};


export const deleteAvatar = async (avatarUrl) => {
  try {
    if (!avatarUrl) return;

    const publicId = getPublicIdFromUrl(avatarUrl);
    const result = await cloudinary.uploader.destroy(publicId);

    return result; 
  } catch (error) {
    console.error("Error deleting avatar:", error);
    throw error;
  }
};