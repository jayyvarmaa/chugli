import { useState } from "react";
import { useServerStore } from "../../store/useServerStore";
import toast from "react-hot-toast";

function JoinServerModal({ onClose }) {
  const [serverId, setServerId] = useState("");
  const { joinServer, isCreatingServer } = useServerStore();

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!serverId.trim()) return;

    try {
      await joinServer(serverId.trim());
      toast.success("Joined server!");
      onClose();
    } catch (error) {
      // Error handled by store
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#313338] text-slate-200 w-full max-w-md rounded-lg shadow-xl overflow-hidden p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 className="text-2xl font-bold text-center mb-2">Join a Server</h2>
        <p className="text-slate-400 text-center mb-6 text-sm text-balance">
          Enter an invite below to join an existing server.
        </p>

        <form onSubmit={handleJoin}>
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
              Invite Link / Server ID <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={serverId}
              onChange={(e) => setServerId(e.target.value)}
              className="w-full bg-[#1e1f22] border-none rounded p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. 64b2d8... or https://discord.gg/hZq5s"
              required
            />
            <p className="text-xs text-slate-400 mt-2">
              Right now, we only support raw Server IDs. Copy one from a friend.
            </p>
          </div>

          <div className="flex justify-between items-center bg-[#2b2d31] -mx-6 -mb-6 p-4">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-slate-300 hover:underline px-4 py-2"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!serverId.trim() || isCreatingServer}
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-medium px-6 py-2 rounded transition-colors disabled:opacity-50"
            >
              {isCreatingServer ? "Joining..." : "Join Server"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JoinServerModal;
