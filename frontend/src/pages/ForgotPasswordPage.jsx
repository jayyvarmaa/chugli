import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { forgotPassword } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await forgotPassword(email);
    setIsSubmitting(false);
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 fixed inset-0" 
      style={{ 
        backgroundColor: "#f5f0e8",
        backgroundImage: `
          repeating-linear-gradient(0deg, rgba(26, 26, 26, 0.03) 0px, rgba(26, 26, 26, 0.03) 1px, transparent 1px, transparent 60px),
          repeating-linear-gradient(90deg, rgba(26, 26, 26, 0.03) 0px, rgba(26, 26, 26, 0.03) 1px, transparent 1px, transparent 60px)
        `,
        backgroundAttachment: "fixed",
        overflow: "hidden",
      }}
    >
      <div className="w-full max-w-md flex-1 flex items-center">
        <div className="w-full space-y-8">
          {/* HEADER */}
          <div className="text-left space-y-2">
            <h1 className="text-5xl font-black" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a", lineHeight: "1" }}>
              RESET PASSWORD
            </h1>
            <p style={{ fontFamily: "Inter", color: "#1a1a1a", opacity: 0.7 }}>
              Enter your email address to receive a password reset link.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="block text-xs font-bold mb-2" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3"
                style={{
                  fontFamily: "Inter",
                  backgroundColor: "#ffffff",
                  border: "3px solid #1a1a1a",
                  color: "#1a1a1a",
                }}
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 font-black transition-all active:translate-x-1 active:translate-y-1"
              style={{
                fontFamily: "Space Grotesk",
                backgroundColor: isSubmitting ? "#cccccc" : "#ffcc00",
                border: "4px solid #1a1a1a",
                color: "#1a1a1a",
                boxShadow: "6px 6px 0px #1a1a1a",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontSize: "16px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "SENDING..." : "SEND RESET LINK"}
            </button>
          </form>

          {/* BACK TO LOGIN LINK */}
          <div className="text-center">
            <Link
              to="/login"
              style={{
                fontFamily: "Inter",
                color: "#0055ff",
                textDecoration: "underline",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              BACK TO LOGIN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ForgotPasswordPage;
