import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router";

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp, sendEmailLink } = useAuthStore();
  const [isSendingLink, setIsSendingLink] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  const handleMagicLink = async () => {
    if (!formData.email) {
      const email = window.prompt("Please enter your email to receive a magic link:");
      if (!email) return;
      setIsSendingLink(true);
      await sendEmailLink(email);
      setIsSendingLink(false);
    } else {
      setIsSendingLink(true);
      await sendEmailLink(formData.email);
      setIsSendingLink(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 fixed inset-0 bg-[#f5f0e8] font-['Space_Grotesk']">
      {/* Paper texture and grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }}></div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: `radial-gradient(#1a1a1a 0.5px, transparent 0.5px)`, backgroundSize: "20px 20px" }}></div>

      <div className="w-full max-w-md flex-1 flex items-center relative z-10 overflow-y-auto pt-20 pb-10">
        <div className="w-full space-y-8 p-10 bg-white border-[4px] border-[#1a1a1a] shadow-[12px_12px_0px_#1a1a1a] rotate-[-1deg]">
          {/* HEADER */}
          <div className="text-left space-y-2 mb-8 border-b-[4px] border-[#1a1a1a] pb-4">
            <h1 className="text-6xl font-black text-[#1a1a1a] tracking-tighter">
              SIGN UP
            </h1>
            <p className="text-xs font-black uppercase tracking-widest text-[#1a1a1a]/60">JOIN THE SHIT-TALK REVOLUTION</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="auth-input-label">YOUR CALLSIGN (FULL NAME)</label>
              <input
                type="text"
                className="input"
                placeholder="JOHN DOE"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="auth-input-label">EMAIL ADDRESS</label>
              <input
                type="email"
                className="input"
                placeholder="YOU@EXAMPLE.COM"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="auth-input-label">CREATE PASSWORD</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={isSigningUp}
            >
              {isSigningUp ? "RECRUITING..." : "JOIN CHUG-LI"}
            </button>
          </form>

          <div className="pt-6 border-t-2 border-black/10 flex flex-col gap-3">
            <button
              onClick={handleMagicLink}
              disabled={isSendingLink}
              className="w-full py-3 bg-white border-[3px] border-black text-[#1a1a1a] font-black uppercase tracking-tighter text-sm shadow-[4px_4px_0px_#1a1a1a] hover:bg-black hover:text-white hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              {isSendingLink ? "SENDING LINK..." : "STAY ANONYMOUS: MAGIC LINK"}
            </button>
            <p className="text-center text-xs font-bold uppercase py-2">
              Already a member? <Link to="/login" className="underline font-black">LOGIN HERE</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
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

            <div className="flex items-center gap-4 my-6">
              <div style={{ flex: 1, height: "2px", backgroundColor: "#1a1a1a" }} />
              <span style={{ fontFamily: "Space Grotesk", color: "#1a1a1a", opacity: 0.6, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                OR
              </span>
              <div style={{ flex: 1, height: "2px", backgroundColor: "#1a1a1a" }} />
            </div>

            {/* GOOGLE SIGN UP */}
            <button
              onClick={() => useAuthStore.getState().signInWithGoogle()}
              className="w-full py-4 font-black transition-all active:translate-x-1 active:translate-y-1 flex items-center justify-center gap-3 mb-4"
              style={{
                fontFamily: "Space Grotesk",
                backgroundColor: "#ffffff",
                border: "4px solid #1a1a1a",
                color: "#1a1a1a",
                boxShadow: "6px 6px 0px #1a1a1a",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
              SIGN UP WITH GOOGLE
            </button>

            {/* MAGIC LINK SIGN UP */}
            <button
              onClick={handleMagicLink}
              disabled={isSendingLink}
              className="w-full py-4 font-black transition-all active:translate-x-1 active:translate-y-1 flex items-center justify-center gap-3"
              style={{
                fontFamily: "Space Grotesk",
                backgroundColor: "#1a1a1a",
                border: "4px solid #1a1a1a",
                color: "#ffffff",
                boxShadow: "6px 6px 0px rgba(0,0,0,0.2)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontSize: "16px",
                cursor: isSendingLink ? "not-allowed" : "pointer",
              }}
            >
              <span className="material-symbols-outlined">mark_email_read</span>
              {isSendingLink ? "SENDING LINK..." : "SIGN UP WITH MAGIC LINK"}
            </button>

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
