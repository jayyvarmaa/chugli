import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn, sendEmailLink } = useAuthStore();
  const [isSendingLink, setIsSendingLink] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
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

      <div className="w-full max-w-md flex-1 flex items-center relative z-10">
        <div className="w-full space-y-8 p-10 bg-white border-[4px] border-[#1a1a1a] shadow-[12px_12px_0px_#1a1a1a] rotate-1">
          {/* HEADER */}
          <div className="text-left space-y-2 mb-8 border-b-[4px] border-[#1a1a1a] pb-4">
            <h1 className="text-6xl font-black text-[#1a1a1a] tracking-tighter">
              LOGIN
            </h1>
            <p className="text-xs font-black uppercase tracking-widest text-[#1a1a1a]/60">CHUG-LI BY @JAYYVARMAA</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="auth-input-label">Email Address</label>
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
              <label className="auth-input-label">Secret Key</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <div className="mt-2 text-right">
                <Link to="/forgot-password" size="sm" className="text-xs font-black uppercase underline hover:text-red-600 transition-colors tracking-tight">
                  Lost your key?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="auth-btn group relative overflow-hidden"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "OPENING ACCESS..." : "ENTER CHUG-LI"}
            </button>
          </form>

          <div className="pt-6 border-t-2 border-black/10 flex flex-col gap-3">
            <button
              onClick={handleMagicLink}
              disabled={isSendingLink}
              className="w-full py-3 bg-white border-[3px] border-black text-[#1a1a1a] font-black uppercase tracking-tighter text-sm shadow-[4px_4px_0px_#1a1a1a] hover:bg-black hover:text-white hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              {isSendingLink ? "SENDING LINK..." : "GET MAGIC LINK"}
            </button>
            <p className="text-center text-xs font-bold uppercase py-2">
              New recruit? <Link to="/signup" className="underline font-black">SIGN UP HERE</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
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

          <div className="flex items-center gap-4 my-6">
            <div style={{ flex: 1, height: "2px", backgroundColor: "#1a1a1a" }} />
            <span style={{ fontFamily: "Space Grotesk", color: "#1a1a1a", opacity: 0.6, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              OR
            </span>
            <div style={{ flex: 1, height: "2px", backgroundColor: "#1a1a1a" }} />
          </div>

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
            SIGN IN WITH GOOGLE
          </button>

          {/* MAGIC LINK SIGN IN */}
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
            {isSendingLink ? "SENDING LINK..." : "SIGN IN WITH MAGIC LINK"}
          </button>
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
