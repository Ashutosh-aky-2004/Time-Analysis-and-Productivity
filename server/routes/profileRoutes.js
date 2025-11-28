import e from "express";
import { getProfileInfo, updatePassword, updatePersonalDetails } from "../controllers/profileControllers.js";

const router = e.Router();

router.get("/details", getProfileInfo);
router.put("/update-profile-data-personal-details",updatePersonalDetails);
router.put("/update-password",updatePassword);

export default router;
