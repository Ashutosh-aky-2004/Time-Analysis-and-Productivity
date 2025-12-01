import express from "express";
import User from "../modal/User.js";

const router = express.Router();

// Get user details for navbar
router.get("/add-details", async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "firstName lastName avatar email"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
