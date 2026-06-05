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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 font-['Space_Grotesk']">
      <div className="bg-white border-[4px] border-black p-8 w-full max-w-md shadow-[12px_12px_0px_#ffcc00] rotate-[-1deg] relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:rotate-90 transition-transform"
        >
          <X size={28} strokeWidth={4} />
        </button>

        <div className="mb-8 border-b-[4px] border-black pb-4">
          <h2 className="text-4xl font-black text-black uppercase tracking-tighter">NEW CHANNEL</h2>
          <p className="text-xs font-black uppercase text-black/50 tracking-widest mt-1">
            ADD MORE NOISE TO THE SERVER
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Channel Type Selection */}
          <div>
            <label className="block text-xs font-black text-black uppercase tracking-widest mb-3 opacity-60">
              CHANNEL TYPE
            </label>
            <div className="flex flex-col gap-3">
              <label 
                className={`flex items-center gap-4 p-4 border-[3px] cursor-pointer transition-all active:shadow-none active:translate-x-1 active:translate-y-1 
                ${type === 'text' ? 'bg-[#ffcc00] border-black shadow-[4px_4px_0px_#000]' : 'bg-[#f5f5f5] border-black/10 hover:border-black shadow-[2px_2px_0px_rgba(0,0,0,0.1)]'}`}
              >
                <Hash size={24} strokeWidth={4} />
                <div className="flex-1">
                  <div className="font-black text-sm uppercase">TEXT</div>
                  <div className="text-[10px] font-bold leading-tight opacity-70">MESSAGES, IMAGES, AND GENERAL CHAOS</div>
                </div>
                <input 
                  type="radio" 
                  name="channelType" 
                  value="text" 
                  checked={type === "text"} 
                  onChange={(e) => setType(e.target.value)} 
                  className="hidden"
                />
              </label>

              <label 
                className={`flex items-center gap-4 p-4 border-[3px] cursor-pointer transition-all active:shadow-none active:translate-x-1 active:translate-y-1 
                ${type === 'voice' ? 'bg-[#ffcc00] border-black shadow-[4px_4px_0px_#000]' : 'bg-[#f5f5f5] border-black/10 hover:border-black shadow-[2px_2px_0px_rgba(0,0,0,0.1)]'}`}
              >
                <Volume2 size={24} strokeWidth={4} />
                <div className="flex-1">
                  <div className="font-black text-sm uppercase">VOICE</div>
                  <div className="text-[10px] font-bold leading-tight opacity-70">REAL-TIME SHIT-TALKING & HANGING OUT</div>
                </div>
                <input 
                  type="radio" 
                  name="channelType" 
                  value="voice" 
                  checked={type === "voice"} 
                  onChange={(e) => setType(e.target.value)} 
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Channel Name */}
          <div>
            <label className="block text-xs font-black text-black uppercase tracking-widest mb-3 opacity-60">
              CHANNEL NAME
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black font-black">
                {type === "text" ? "#" : <Volume2 size={18} strokeWidth={4} />}
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border-[3px] border-black pl-12 pr-4 py-4 text-black font-black uppercase tracking-tighter placeholder:text-black/20 focus:outline-none focus:bg-[#ffcc00] transition-colors"
                placeholder="CHANNEL-NAME"
                maxLength={100}
                autoFocus
              />
            </div>
          </div>
        </form>

        <div className="flex gap-4 mt-10">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-4 border-[3px] border-black font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_#ccc]"
          >
            CANCEL
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isCreatingChannel || !name.trim()}
            className="flex-1 py-4 bg-[#ffcc00] border-[3px] border-black font-black uppercase tracking-widest text-sm shadow-[6px_6px_0px_#1a1a1a] active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-50 disabled:grayscale transition-all"
          >
            {isCreatingChannel ? "BUILDING..." : "CREATE"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChannelModal;
