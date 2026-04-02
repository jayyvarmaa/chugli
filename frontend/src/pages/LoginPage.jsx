import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
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
            <h1 className="text-7xl font-black" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a", lineHeight: "1" }}>
              CHUGLI
            </h1>
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

            {/* PASSWORD */}
            <div>
              <label className="block text-xs font-bold mb-2" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3"
                style={{
                  fontFamily: "Inter",
                  backgroundColor: "#ffffff",
                  border: "3px solid #1a1a1a",
                  color: "#1a1a1a",
                }}
              />
              {/* FORGOT PASSWORD LINK */}
              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  style={{
                    fontFamily: "Inter",
                    color: "#e63b2e",
                    textDecoration: "underline",
                    fontWeight: "600",
                    fontSize: "12px",
                  }}
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 font-black transition-all active:translate-x-1 active:translate-y-1"
              style={{
                fontFamily: "Space Grotesk",
                backgroundColor: isLoggingIn ? "#cccccc" : "#ffcc00",
                border: "4px solid #1a1a1a",
                color: "#1a1a1a",
                boxShadow: "6px 6px 0px #1a1a1a",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontSize: "16px",
                cursor: isLoggingIn ? "not-allowed" : "pointer",
              }}
            >
              {isLoggingIn ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>

          {/* SIGN UP LINK */}
          <div className="text-center">
            <p style={{ fontFamily: "Inter", color: "#1a1a1a", fontSize: "14px" }}>
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{
                  color: "#0055ff",
                  textDecoration: "underline",
                  fontWeight: "bold",
                }}
              >
                SIGN UP
              </Link>
            </p>
          </div>

          {/* TEST ACCOUNT QUICK LOGIN BUTTONS */}
          <div className="space-y-3 pt-4 border-t-2" style={{ borderColor: "#1a1a1a" }}>
            <p style={{ fontFamily: "Space Grotesk", color: "#1a1a1a", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.6 }}>
              Quick Test Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFormData({ email: "alex@example.com", password: "password123" })}
                className="px-3 py-2 text-xs font-bold transition-all active:translate-x-0.5 active:translate-y-0.5"
                style={{
                  fontFamily: "Space Grotesk",
                  backgroundColor: "#0055ff",
                  border: "2px solid #1a1a1a",
                  color: "#ffffff",
                  boxShadow: "3px 3px 0px #1a1a1a",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                }}
              >
                Alex Dev
              </button>
              <button
                onClick={() => setFormData({ email: "sarah@example.com", password: "password123" })}
                className="px-3 py-2 text-xs font-bold transition-all active:translate-x-0.5 active:translate-y-0.5"
                style={{
                  fontFamily: "Space Grotesk",
                  backgroundColor: "#e63b2e",
                  border: "2px solid #1a1a1a",
                  color: "#ffffff",
                  boxShadow: "3px 3px 0px #1a1a1a",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                }}
              >
                Sarah Design
              </button>
              <button
                onClick={() => setFormData({ email: "mike@example.com", password: "password123" })}
                className="px-3 py-2 text-xs font-bold transition-all active:translate-x-0.5 active:translate-y-0.5"
                style={{
                  fontFamily: "Space Grotesk",
                  backgroundColor: "#ffcc00",
                  border: "2px solid #1a1a1a",
                  color: "#1a1a1a",
                  boxShadow: "3px 3px 0px #1a1a1a",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                }}
              >
                Mike Tech
              </button>
              <button
                onClick={() => setFormData({ email: "emma@example.com", password: "password123" })}
                className="px-3 py-2 text-xs font-bold transition-all active:translate-x-0.5 active:translate-y-0.5"
                style={{
                  fontFamily: "Space Grotesk",
                  backgroundColor: "#00cc99",
                  border: "2px solid #1a1a1a",
                  color: "#ffffff",
                  boxShadow: "3px 3px 0px #1a1a1a",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                }}
              >
                Emma Creative
              </button>
              <button
                onClick={() => setFormData({ email: "john@example.com", password: "password123" })}
                className="px-3 py-2 text-xs font-bold col-span-2 transition-all active:translate-x-0.5 active:translate-y-0.5"
                style={{
                  fontFamily: "Space Grotesk",
                  backgroundColor: "#9d4edd",
                  border: "2px solid #1a1a1a",
                  color: "#ffffff",
                  boxShadow: "3px 3px 0px #1a1a1a",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                }}
              >
                John Startup
              </button>
            </div>
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
export default LoginPage;
