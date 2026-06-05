import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

function VerifyEmailPage() {
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const navigate = useNavigate();
  const { verifyEmailLink } = useAuthStore();

  useEffect(() => {
    const handleVerify = async () => {
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Please provide your email for confirmation");
      }

      if (!email) {
        setStatus("error");
        toast.error("Email is required to sign in with a magic link.");
        return;
      }

      const success = await verifyEmailLink(window.location.href, email);
      if (success) {
        setStatus("success");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setStatus("error");
      }
    };

    handleVerify();
  }, [verifyEmailLink, navigate]);

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4" 
      style={{ 
        backgroundColor: "#f5f0e8",
        backgroundImage: `
          repeating-linear-gradient(0deg, rgba(26, 26, 26, 0.03) 0px, rgba(26, 26, 26, 0.03) 1px, transparent 1px, transparent 60px),
          repeating-linear-gradient(90deg, rgba(26, 26, 26, 0.03) 0px, rgba(26, 26, 26, 0.03) 1px, transparent 1px, transparent 60px)
        `,
      }}
    >
      <div className="w-full max-w-md p-8 text-center" style={{ backgroundColor: "#ffffff", border: "4px solid #1a1a1a", boxShadow: "8px 8px 0px #1a1a1a" }}>
        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "Space Grotesk" }}>
          MAGIC LINK
        </h1>
        
        {status === "verifying" && (
          <div className="space-y-4">
            <span className="material-symbols-outlined animate-spin text-5xl" style={{ color: "#ffcc00" }}>
              progress_activity
            </span>
            <p style={{ fontFamily: "Inter", fontWeight: "600" }}>Verifying your magic link...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <span className="material-symbols-outlined text-5xl" style={{ color: "#00cc66" }}>
              check_circle
            </span>
            <p style={{ fontFamily: "Inter", fontWeight: "600" }}>Successfully signed in! Redirecting...</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <span className="material-symbols-outlined text-5xl" style={{ color: "#e63b2e" }}>
              error
            </span>
            <p style={{ fontFamily: "Inter", fontWeight: "600" }}>Failed to verify link. It may be expired or invalid.</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 font-bold"
              style={{
                fontFamily: "Space Grotesk",
                backgroundColor: "#1a1a1a",
                color: "#ffffff",
                textTransform: "uppercase",
              }}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmailPage;
