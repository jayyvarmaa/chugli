import { Link } from "react-router";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
      {/* DECORATORS - GRID BG & GLOW SHAPES */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

      <div className="max-w-4xl w-full z-10 text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
          Welcome to <span className="text-primary-500 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500">Chugli</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          A secure and vibrant space for real-time conversations. Join servers, create channels, and stay connected with your community.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          to="/login"
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all transform hover:scale-105"
        >
          Get Started
        </Link>
        <Link
          to="/privacy"
          className="text-slate-400 hover:text-white transition-colors"
        >
          Privacy Policy
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="p-6 bg-slate-800/50 rounded-2xl border border-white/10 backdrop-blur-sm">
          <h3 className="text-white font-semibold mb-2">Real-time Chat</h3>
          <p className="text-slate-400 text-sm">Instant messaging powered by Socket.io for seamless communication.</p>
        </div>
        <div className="p-6 bg-slate-800/50 rounded-2xl border border-white/10 backdrop-blur-sm">
          <h3 className="text-white font-semibold mb-2">Community Servers</h3>
          <p className="text-slate-400 text-sm">Organize your groups into dedicated servers and themed channels.</p>
        </div>
        <div className="p-6 bg-slate-800/50 rounded-2xl border border-white/10 backdrop-blur-sm">
          <h3 className="text-white font-semibold mb-2">Secure Auth</h3>
          <p className="text-slate-400 text-sm">Robust authentication and data protection for your privacy.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
