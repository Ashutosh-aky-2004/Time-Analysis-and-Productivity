import User from "../modal/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

// 1. Generate OTP and send to client (so client can send via EmailJS)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6 digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before saving
    const salt = await bcrypt.genSalt(10);
    user.resetPasswordOtp = await bcrypt.hash(otp, salt);

    // Set expiration (e.g., 5 minutes)
    user.resetPasswordOtpExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    // Return the unhashed OTP to the client to send via EmailJS
    // NOTE: This exposes the OTP to the client (Network Tab), but matches the requested flow:
    // Frontend -> EmailJS, Backend -> Generate OTP.
    res.status(200).json({
      success: true,
      message: "OTP generated",
      otp,
      email: user.email,
      name: user.firstName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Select the sensitive fields
    const user = await User.findOne({ email }).select(
      "+resetPasswordOtp +resetPasswordOtpExpires"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetPasswordOtp || !user.resetPasswordOtpExpires) {
      return res
        .status(400)
        .json({ message: "Invalid request or OTP expired" });
    }

    if (Date.now() > user.resetPasswordOtpExpires) {
      user.resetPasswordOtp = undefined;
      user.resetPasswordOtpExpires = undefined;
      await user.save();
      return res.status(400).json({ message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, user.resetPasswordOtp);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.status(200).json({ success: true, message: "OTP verified" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 3. Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email }).select(
      "+resetPasswordOtp +resetPasswordOtpExpires"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetPasswordOtp || !user.resetPasswordOtpExpires) {
      return res
        .status(400)
        .json({ message: "Invalid request or OTP expired" });
    }

    // Double check OTP validity to be safe (stateless check)
    if (Date.now() > user.resetPasswordOtpExpires) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, user.resetPasswordOtp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Set new password (pre-save hook will hash it)
    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
