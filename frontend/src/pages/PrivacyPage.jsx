const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
      {/* DECORATORS - GRID BG & GLOW SHAPES */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

      <div className="max-w-3xl w-full z-10 bg-slate-800/80 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 animate-fade-in overflow-y-auto max-h-[80vh]">
        <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
      <p className="text-slate-400 text-sm">Last Updated: June 5, 2026</p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">1. Introduction</h2>
        <p className="text-slate-400">
          Welcome to Chugli. We value your privacy and are committed to protecting your personal data. This privacy policy explains how we handle your information when you use our application.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">2. Data We Collect</h2>
        <ul className="list-disc list-inside text-slate-400 space-y-2">
          <li>Account Information: Name, email address, and profile picture.</li>
          <li>Chat Data: Messages and media shared within the application.</li>
          <li>Usage Information: Technical data such as IP address and browser type.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">3. How We Use Your Data</h2>
        <p className="text-slate-400">
          Your data is used solely to provide and improve the chat experience, verify your identity via Firebase Auth, and maintain the security of our services. We do not sell your personal information to third parties.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">4. Third-Party Services</h2>
        <p className="text-slate-400">
          We use Google/Firebase for authentication and hosting. Their use of your data is governed by their respective privacy policies.
        </p>
      </section>

      <div className="pt-6 border-t border-white/10">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default PrivacyPage;
