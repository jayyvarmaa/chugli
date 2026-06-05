import { useState } from "react";
import { useServerStore } from "../../store/useServerStore";
import { X, Hash, Volume2 } from "lucide-react";

const CreateChannelModal = ({ isOpen, onClose, serverId }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("text"); // 'text' or 'voice'
  const { createChannel, isCreatingChannel } = useServerStore();

  if (!isOpen || !serverId) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Remove spaces and format channel name properly
    const formattedName = type === "text" ? name.trim().toLowerCase().replace(/\s+/g, '-') : name.trim();

    const channel = await createChannel({ 
      name: formattedName,
      type,
      serverId
    });

    if (channel) {
      setName("");
      setType("text");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#313338] rounded-xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
          >
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Create Channel</h2>
          <p className="text-slate-300 text-sm">
            in Text Channels
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-0 flex flex-col gap-6">
          {/* Channel Type Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Channel Type
            </label>
            <div className="flex flex-col gap-2 bg-[#2b2d31] rounded-lg p-2">
              <label className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${type === 'text' ? 'bg-[#404249]' : 'hover:bg-[#35373c]'}`}>
                <Hash size={24} className="text-slate-400" />
                <div className="flex-1">
                  <div className="text-slate-200 font-medium text-sm">Text</div>
                  <div className="text-slate-400 text-xs">Send messages, images, GIFs, emoji, opinions, and puns</div>
                </div>
                <input 
                  type="radio" 
                  name="channelType" 
                  value="text" 
                  checked={type === "text"} 
                  onChange={(e) => setType(e.target.value)} 
                  className="w-5 h-5 accent-indigo-500"
                />
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${type === 'voice' ? 'bg-[#404249]' : 'hover:bg-[#35373c]'}`}>
                <Volume2 size={24} className="text-slate-400" />
                <div className="flex-1">
                  <div className="text-slate-200 font-medium text-sm">Voice</div>
                  <div className="text-slate-400 text-xs">Hang out together with voice, video, and screen share</div>
                </div>
                <input 
                  type="radio" 
                  name="channelType" 
                  value="voice" 
                  checked={type === "voice"} 
                  onChange={(e) => setType(e.target.value)} 
                  className="w-5 h-5 accent-indigo-500"
                />
              </label>
            </div>
          </div>

          {/* Channel Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Channel Name
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                {type === "text" ? <Hash size={18} /> : <Volume2 size={18} />}
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1e1f22] border-none rounded-md pl-10 pr-3 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="new-channel"
                maxLength={100}
                autoFocus
              />
            </div>
          </div>
        </form>

        <div className="bg-[#2b2d31] p-4 flex justify-between items-center mt-auto">
          <button 
            type="button"
            onClick={onClose}
            className="text-sm text-slate-300 hover:underline px-4 py-2"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isCreatingChannel || !name.trim()}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
          >
            {isCreatingChannel ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Creating...
              </>
            ) : "Create Channel"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChannelModal;
