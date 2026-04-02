import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { axiosInstance } from "../lib/axios";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // email, verification, reset
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Step 1: Request verification email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      
      if (res.data.success) {
        setSuccessMessage("Verification code sent to your email!");
        setStep("verification");
        setError("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send verification email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify code and set new password
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!verificationCode) {
      setError("Please enter the verification code");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please enter your new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/auth/verify-reset-code", {
        email,
        verificationCode,
        newPassword,
      });

      if (res.data.success) {
        setSuccessMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    setError("");
    setIsResending(true);
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      if (res.data.success) {
        setSuccessMessage("Verification code resent to your email!");
        setVerificationCode("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend verification code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 absolute inset-0" 
      style={{ 
        backgroundColor: "#f5f0e8",
        backgroundImage: `
          repeating-linear-gradient(0deg, rgba(26, 26, 26, 0.03) 0px, rgba(26, 26, 26, 0.03) 1px, transparent 1px, transparent 60px),
          repeating-linear-gradient(90deg, rgba(26, 26, 26, 0.03) 0px, rgba(26, 26, 26, 0.03) 1px, transparent 1px, transparent 60px)
        `,
        backgroundAttachment: "fixed",
        overflow: "hidden",
        zIndex: 50,
      }}
    >
      <div className="w-full max-w-md flex-1 flex items-center">
        <div className="w-full space-y-8">
          {/* HEADER */}
          <div className="text-left space-y-2">
            <h1 className="text-6xl font-black" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a", lineHeight: "1" }}>
              RESET
            </h1>
            <p style={{ fontFamily: "Inter", color: "#1a1a1a", fontSize: "14px", opacity: 0.7 }}>
              Regain access to your account
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div
              className="p-4 border-2"
              style={{
                backgroundColor: "#fff5f5",
                borderColor: "#e63b2e",
                color: "#e63b2e",
                fontFamily: "Inter",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div
              className="p-4 border-2"
              style={{
                backgroundColor: "#f0fff4",
                borderColor: "#00cc99",
                color: "#00cc99",
                fontFamily: "Inter",
                fontSize: "13px",
              }}
            >
              {successMessage}
            </div>
          )}

          {/* STEP 1: EMAIL VERIFICATION REQUEST */}
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold mb-2" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3"
                  style={{
                    fontFamily: "Inter",
                    backgroundColor: "#ffffff",
                    border: "3px solid #1a1a1a",
                    color: "#1a1a1a",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 font-black transition-all active:translate-x-1 active:translate-y-1"
                style={{
                  fontFamily: "Space Grotesk",
                  backgroundColor: isLoading ? "#cccccc" : "#0055ff",
                  border: "4px solid #1a1a1a",
                  color: "#ffffff",
                  boxShadow: "6px 6px 0px #1a1a1a",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontSize: "16px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                {isLoading ? "SENDING EMAIL..." : "SEND VERIFICATION CODE"}
              </button>
            </form>
          )}

          {/* STEP 2: VERIFICATION CODE & NEW PASSWORD */}
          {step === "verification" && (
            <form onSubmit={handleVerificationSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold mb-2" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter code from email"
                  maxLength="6"
                  className="w-full px-4 py-3 tracking-widest text-center"
                  style={{
                    fontFamily: "Inter",
                    backgroundColor: "#ffffff",
                    border: "3px solid #1a1a1a",
                    color: "#1a1a1a",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="flex-1 py-3 font-black transition-all active:translate-x-0.5 active:translate-y-0.5"
                  style={{
                    fontFamily: "Space Grotesk",
                    backgroundColor: isResending ? "#cccccc" : "#e63b2e",
                    border: "3px solid #1a1a1a",
                    color: "#ffffff",
                    boxShadow: "4px 4px 0px #1a1a1a",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontSize: "13px",
                    cursor: isResending ? "not-allowed" : "pointer",
                  }}
                >
                  {isResending ? "RESENDING..." : "RESEND CODE"}
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold mb-2" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3"
                  style={{
                    fontFamily: "Inter",
                    backgroundColor: "#ffffff",
                    border: "3px solid #1a1a1a",
                    color: "#1a1a1a",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3"
                  style={{
                    fontFamily: "Inter",
                    backgroundColor: "#ffffff",
                    border: "3px solid #1a1a1a",
                    color: "#1a1a1a",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 font-black transition-all active:translate-x-1 active:translate-y-1"
                style={{
                  fontFamily: "Space Grotesk",
                  backgroundColor: isLoading ? "#cccccc" : "#00cc99",
                  border: "4px solid #1a1a1a",
                  color: "#1a1a1a",
                  boxShadow: "6px 6px 0px #1a1a1a",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontSize: "16px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                {isLoading ? "RESETTING..." : "RESET PASSWORD"}
              </button>
            </form>
          )}

          {/* BACK TO LOGIN */}
          <div className="text-center">
            <p style={{ fontFamily: "Inter", color: "#1a1a1a", fontSize: "14px" }}>
              Remember your password?{" "}
              <Link
                to="/login"
                style={{
                  color: "#0055ff",
                  textDecoration: "underline",
                  fontWeight: "bold",
                }}
              >
                SIGN IN
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center py-6">
        <p style={{ fontFamily: "Inter", color: "#1a1a1a", fontSize: "12px", opacity: 0.6 }}>
          Built by{" "}
          <a
            href="https://jayvarma.site"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#0055ff",
              textDecoration: "underline",
              fontWeight: "600",
            }}
          >
            @jayyvarmaa
          </a>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
