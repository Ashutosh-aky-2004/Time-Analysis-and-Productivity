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

    // Send Email via EmailJS REST API from Backend
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    // Private Key is optional for this endpoint if Public Key is used, but strictly speaking for backend calls typically we might use the private key signature if configured.
    // For simplicity and standard EmailJS usage, we use the Public Key (User ID).

    // We will attempt to send the email if keys are present
    if (serviceId && templateId && publicKey) {
      try {
        const emailResponse = await fetch(
          "https://api.emailjs.com/api/v1.0/email/send",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              service_id: serviceId,
              template_id: templateId,
              user_id: publicKey,
              template_params: {
                to_email: user.email,
                to_name: user.firstName,
                otp: otp,
                message: `Your OTP for password reset is: ${otp}`,
              },
            }),
          }
        );

        if (!emailResponse.ok) {
          const text = await emailResponse.text();
          console.error("EmailJS Send Failed:", text);
          // We don't block the response, but we should probably alert errors in real prod
        }
      } catch (emailErr) {
        console.error("Error sending email via EmailJS:", emailErr);
      }
    } else {
      console.log("--------------------------------");
      console.log("EMAILJS KEYS MISSING IN SERVER .ENV");
      console.log(`OTP for ${user.email}: ${otp}`);
      console.log("--------------------------------");
    }

    // Return success WITHOUT the OTP
    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
      email: user.email,
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
