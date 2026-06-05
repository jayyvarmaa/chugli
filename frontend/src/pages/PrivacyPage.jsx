const PrivacyPage = () => {
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
      <div className="max-w-3xl w-full z-10 bg-white border-[4px] border-[#1a1a1a] shadow-[10px_10px_0px_#1a1a1a] p-10 space-y-8 animate-fade-in overflow-y-auto max-h-[85vh]">
        <div className="border-b-[4px] border-[#1a1a1a] pb-6">
          <h1 className="text-5xl font-black uppercase tracking-tighter" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a" }}>Privacy Policy</h1>
          <p className="font-bold text-sm tracking-widest mt-2" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a" }}>LAST UPDATED: JUNE 5, 2026</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a" }}>1. Introduction</h2>
          <p className="font-medium leading-relaxed" style={{ fontFamily: "Inter", color: "#1a1a1a" }}>
            Welcome to Chugli by @jayyvarmaa. We value your privacy and are committed to protecting your personal data. This privacy policy explains how we handle your information when you use our application.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a" }}>2. Data We Collect</h2>
          <ul className="list-none space-y-3 font-medium" style={{ fontFamily: "Inter", color: "#1a1a1a" }}>
            <li className="flex items-center gap-2"><span className="size-2 bg-[#ffcc00] border border-[#1a1a1a]"></span> Account Information: Name, email address, and profile picture.</li>
            <li className="flex items-center gap-2"><span className="size-2 bg-[#ffcc00] border border-[#1a1a1a]"></span> Chat Data: Messages and media shared within the application.</li>
            <li className="flex items-center gap-2"><span className="size-2 bg-[#ffcc00] border border-[#1a1a1a]"></span> Usage Information: Technical data such as IP address and browser type.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a" }}>3. How We Use Your Data</h2>
          <p className="font-medium leading-relaxed" style={{ fontFamily: "Inter", color: "#1a1a1a" }}>
            Your data is used solely to provide and improve the chat experience, verify your identity via Firebase Auth, and maintain the security of our services. We do not sell your personal information to third parties.
          </p>
        </section>

        <div className="pt-8 flex justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-[#1a1a1a] text-white font-black uppercase tracking-widest hover:bg-slate-800 transition-colors"
            style={{ fontFamily: "Space Grotesk" }}
          >
            Go Back
          </button>
          <span className="text-sm font-bold opacity-30" style={{ fontFamily: "Space Grotesk" }}>CHUGLI OAUTH COMPLIANCE</span>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
