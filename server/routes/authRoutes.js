import e from "express";
import { login, signup, googleLogin } from "../controllers/Register.js";

const router = e.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google-login", googleLogin);

import {
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/forgotPasswordController.js";

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
