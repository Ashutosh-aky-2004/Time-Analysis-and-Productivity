import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMail, FiLock, FiKey } from "react-icons/fi";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [otpExpiryTimer, setOtpExpiryTimer] = useState(0);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (step === 2) {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
        setOtpExpiryTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setGeneratedOtp(data.otp);

      // Send Email via EmailJS
      const templateParams = {
        to_email: email,
        to_name: data.name || "User",
        otp: data.otp,
        message: `Your OTP for password reset is: ${data.otp}`,
      };

      try {
        if (import.meta.env.VITE_EMAILJS_SERVICE_ID) {
          await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            templateParams,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
          );
        } else {
          toast.info("EmailJS keys missing. OTP logged to console.");
          console.log("OTP:", data.otp);
        }

        toast.success("OTP sent to your email");
        setStep(2);
        setResendTimer(60); // 1 minute
        setOtpExpiryTimer(300); // 5 minutes
      } catch (emailError) {
        console.error("EmailJS Error:", emailError);
        toast.error("Failed to send email. Check console for details.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpInput = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP");

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      toast.success("OTP verified successfully");
      setStep(3);
    } catch (error) {
      toast.error(error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetUserPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword)
      return toast.error("Please fill all fields");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, newPassword }),
        }
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      toast.success("Password reset successful. Please login.");
      // Navigate to login which is now AuthForm
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container -mt-9">
      <div className="auth-wrapper" style={{ minHeight: "500px" }}>
        {/* Background shapes */}
        <div className="background-shape"></div>
        <div className="secondary-shape"></div>

        {/* Forgot Password Panel - Centered */}
        <div
          className="credentials-panel"
          style={{ width: "100%", padding: "0 50px", left: 0 }}
        >
          <div className="auth-form-content">
            {step === 1 && (
              <>
                <h2 className="slide-element">Recover Account</h2>
                <p
                  className="slide-element"
                  style={{
                    color: "#9ca3af",
                    marginBottom: "20px",
                    textAlign: "center",
                  }}
                >
                  Enter your email to receive an OTP.
                </p>

                <form onSubmit={sendOtp} style={{ width: "100%" }}>
                  <div className="field-wrapper slide-element">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>Email Address</label>
                    <FiMail className="input-icon" />
                  </div>

                  <div
                    className="slide-element"
                    style={{
                      marginTop: "25px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <button className="submit-button" disabled={loading}>
                      {loading ? "Sending..." : "Send OTP"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="slide-element">Verify OTP</h2>
                <p
                  className="slide-element"
                  style={{
                    color: "#9ca3af",
                    marginBottom: "10px",
                    textAlign: "center",
                  }}
                >
                  Code sent to <span style={{ color: "#3b82f6" }}>{email}</span>
                </p>

                <div
                  className="slide-element"
                  style={{
                    marginBottom: "20px",
                    color: "#64748b",
                    fontSize: "0.9rem",
                  }}
                >
                  Valid for:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {Math.floor(otpExpiryTimer / 60)}:
                    {(otpExpiryTimer % 60).toString().padStart(2, "0")}
                  </span>
                </div>

                <form onSubmit={verifyOtpInput} style={{ width: "100%" }}>
                  <div className="field-wrapper slide-element">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      style={{ letterSpacing: "0.5em", textAlign: "center" }}
                    />
                    <label
                      style={{
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      ENTER OTP
                    </label>
                    <FiKey className="input-icon" />
                  </div>

                  <div
                    className="slide-element"
                    style={{
                      marginTop: "25px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <button className="submit-button" disabled={loading}>
                      {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </div>
                </form>

                <div className="switch-link slide-element">
                  {resendTimer > 0 ? (
                    <p>Resend in {resendTimer}s</p>
                  ) : (
                    <button type="button" onClick={sendOtp} disabled={loading}>
                      Resend OTP
                    </button>
                  )}
                  <br />
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      marginTop: "10px",
                      fontSize: "0.85rem",
                      color: "#94a3b8",
                    }}
                  >
                    Change Email
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="slide-element">Reset Password</h2>

                <form onSubmit={resetUserPassword} style={{ width: "100%" }}>
                  <div className="field-wrapper slide-element">
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <label>New Password</label>
                    <FiLock className="input-icon" />
                  </div>

                  <div className="field-wrapper slide-element">
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <label>Confirm Password</label>
                    <FiLock className="input-icon" />
                  </div>

                  <div
                    className="slide-element"
                    style={{
                      marginTop: "25px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <button className="submit-button" disabled={loading}>
                      {loading ? "Resetting..." : "Reset Password"}
                    </button>
                  </div>
                </form>
              </>
            )}

            <div className="switch-link slide-element">
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  color: "#60a5fa",
                  fontWeight: "bold",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px",
                  }}
                >
                  <FiArrowLeft /> Back to Login
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
