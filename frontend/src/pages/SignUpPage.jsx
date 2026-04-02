import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router";

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 fixed inset-0" 
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
      <div className="w-full max-w-2xl">
        <div className="space-y-12">
          {/* HEADER SECTION */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center gap-3 p-4" style={{ backgroundColor: "#1a1a1a", border: "4px solid #1a1a1a" }}>
              <span className="material-symbols-outlined text-4xl" style={{ color: "#ffcc00" }}>
                person_add
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a" }}>
              CHUGLI
            </h1>
            <p className="text-lg" style={{ fontFamily: "Inter", color: "#1a1a1a", opacity: 0.7 }}>
              JOIN THE CONVERSATION
            </p>
          </div>

          {/* FORM SECTION */}
          <div className="space-y-8">
            {/* HEADING WITH YELLOW HIGHLIGHT */}
            <div className="flex items-baseline gap-4">
              <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a" }}>
                CREATE ACCOUNT
              </h2>
              <div style={{ backgroundColor: "#ffcc00", height: "8px", flex: 1 }} />
            </div>

            {/* SIGNUP FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* FULL NAME INPUT */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 text-base"
                    style={{
                      fontFamily: "Inter",
                      backgroundColor: "#ffffff",
                      border: "4px solid #1a1a1a",
                      color: "#1a1a1a",
                      boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </div>
              </div>

              {/* EMAIL INPUT */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 text-base"
                    style={{
                      fontFamily: "Inter",
                      backgroundColor: "#ffffff",
                      border: "4px solid #1a1a1a",
                      color: "#1a1a1a",
                      boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </div>
              </div>

              {/* PASSWORD INPUT */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 text-base"
                    style={{
                      fontFamily: "Inter",
                      backgroundColor: "#ffffff",
                      border: "4px solid #1a1a1a",
                      color: "#1a1a1a",
                      boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSigningUp}
                className="w-full py-4 font-bold text-lg transition-all duration-200"
                style={{
                  fontFamily: "Space Grotesk",
                  backgroundColor: "#ffcc00",
                  border: "4px solid #1a1a1a",
                  color: "#1a1a1a",
                  boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.1)",
                  cursor: isSigningUp ? "not-allowed" : "pointer",
                  opacity: isSigningUp ? 0.6 : 1,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
                onMouseEnter={(e) => {
                  if (!isSigningUp) {
                    e.target.style.transform = "translate(4px, 4px)";
                    e.target.style.boxShadow = "0px 0px 0px rgba(0, 0, 0, 0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSigningUp) {
                    e.target.style.transform = "translate(0, 0)";
                    e.target.style.boxShadow = "4px 4px 0px rgba(0, 0, 0, 0.1)";
                  }
                }}
              >
                {isSigningUp ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined animate-spin">
                      progress_activity
                    </span>
                    CREATING ACCOUNT...
                  </div>
                ) : (
                  "CREATE ACCOUNT"
                )}
              </button>
            </form>

            {/* LOGIN LINK */}
            <div className="text-center">
              <p style={{ fontFamily: "Inter", color: "#1a1a1a", opacity: 0.7 }}>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold"
                  style={{
                    color: "#0055ff",
                    textDecoration: "none",
                    borderBottom: "2px solid #0055ff",
                  }}
                >
                  LOGIN
                </Link>
              </p>
            </div>

            {/* DIVIDER */}
            <div className="flex items-center gap-4 my-8">
              <div style={{ flex: 1, height: "2px", backgroundColor: "#1a1a1a" }} />
              <span style={{ fontFamily: "Space Grotesk", color: "#1a1a1a", opacity: 0.6, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                YOUR BENEFITS
              </span>
              <div style={{ flex: 1, height: "2px", backgroundColor: "#1a1a1a" }} />
            </div>

            {/* BENEFITS */}
            <div className="grid grid-cols-1 gap-3">
              {[
                { icon: "verified", text: "FREE ACCOUNT" },
                { icon: "rocket_launch", text: "INSTANT SETUP" },
                { icon: "shield", text: "ENCRYPTED CHATS" },
              ].map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "2px solid #1a1a1a",
                  }}
                >
                  <span className="material-symbols-outlined text-2xl" style={{ color: "#0055ff" }}>
                    {benefit.icon}
                  </span>
                  <p style={{ fontFamily: "Space Grotesk", color: "#1a1a1a", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>
                    {benefit.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignUpPage;
