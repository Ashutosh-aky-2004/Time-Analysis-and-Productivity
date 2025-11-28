import express from "express";
import { 
  getProfileInfo, 
  updatePassword, 
  updatePersonalDetails, 
  updateProfileAvatar
} from "../controllers/profileControllers.js";
import uploadRoutes from "./uploadRoutes.js";

const router = express.Router();

// Upload route
router.use("/upload", uploadRoutes);
router.put("/update-avatar", updateProfileAvatar);

// Profile routes
router.get("/details", getProfileInfo);
router.put("/update-profile-data-personal-details", updatePersonalDetails);
router.put("/update-password", updatePassword);

export default router;
