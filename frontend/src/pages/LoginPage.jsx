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
    let email = formData.email;
    if (!email) {
      email = window.prompt("Please enter your email to receive a magic link:");
      if (!email) return;
    }
    
    setIsSendingLink(true);
    await sendEmailLink(email);
    setIsSendingLink(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 fixed inset-0 bg-[#f5f0e8] font-['Space_Grotesk'] overflow-y-auto">
      {/* Paper texture and grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }}></div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: `radial-gradient(#1a1a1a 0.5px, transparent 0.5px)`, backgroundSize: "20px 20px" }}></div>

      <div className="w-full max-w-md py-12 relative z-10 flex flex-col">
        <div className="w-full space-y-6 p-10 bg-white border-[4px] border-[#1a1a1a] shadow-[12px_12px_0px_#1a1a1a] rotate-1">
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

        {/* FOOTER */}
        <div className="text-center py-6 mt-4">
          <p className="text-[12px] font-black uppercase tracking-widest opacity-40">
            Built by <a href="https://jayvarma.site" target="_blank" rel="noopener noreferrer" className="underline hover:text-black">@jayyvarmaa</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
