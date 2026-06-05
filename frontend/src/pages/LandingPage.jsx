import { Link } from "react-router";

const LandingPage = () => {
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
      <div className="max-w-4xl w-full z-10 text-center space-y-12 animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a", lineHeight: "1.1" }}>
            CHUGLI
            <span className="block text-2xl md:text-3xl mt-1 not-italic tracking-[0.3em] font-black opacity-30">BY @JAYYVARMAA</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold max-w-2xl mx-auto uppercase" style={{ fontFamily: "Inter", color: "#1a1a1a" }}>
            A secure and vibrant space for real-time conversations. join servers, create channels, and stay connected with your community.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            to="/login"
            className="w-full sm:w-auto px-12 py-5 bg-[#ffcc00] text-[#1a1a1a] font-black border-[4px] border-[#1a1a1a] shadow-[8px_8px_0px_#1a1a1a] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase tracking-widest text-xl"
            style={{ fontFamily: "Space Grotesk" }}
          >
            Get Started
          </Link>
          <Link
            to="/privacy"
            className="font-bold text-[#1a1a1a] hover:underline uppercase tracking-widest"
            style={{ fontFamily: "Space Grotesk" }}
          >
            Privacy Policy
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
          <div className="p-8 bg-white border-[4px] border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a]">
            <h3 className="font-black text-xl mb-3 uppercase tracking-tight" style={{ fontFamily: "Space Grotesk" }}>Real-time Chat</h3>
            <p className="text-[#1a1a1a] font-medium leading-relaxed">Instant messaging powered by Socket.io for seamless communication.</p>
          </div>
          <div className="p-8 bg-white border-[4px] border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a]">
            <h3 className="font-black text-xl mb-3 uppercase tracking-tight" style={{ fontFamily: "Space Grotesk" }}>Community Servers</h3>
            <p className="text-[#1a1a1a] font-medium leading-relaxed">Organize your groups into dedicated servers and themed channels.</p>
          </div>
          <div className="p-8 bg-[#1a1a1a] text-white shadow-[6px_6px_0px_#ffcc00] border-[4px] border-[#1a1a1a]">
            <h3 className="font-black text-xl mb-3 uppercase tracking-tight" style={{ fontFamily: "Space Grotesk" }}>Secure Auth</h3>
            <p className="text-slate-300 font-medium leading-relaxed">Robust authentication and data protection for your privacy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
