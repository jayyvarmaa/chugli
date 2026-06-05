import { useState, useEffect } from "react";
import { Hash, Volume2, Settings, Plus } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useServerStore } from "../../store/useServerStore";
import CreateChannelModal from "../Modals/CreateChannelModal";

const ChannelList = ({ server, activeChannelId, onSelectChannel }) => {
  const { authUser, logout } = useAuthStore();
  const { activeServerChannels, getChannels } = useServerStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (server) {
      getChannels(server._id);
    }
  }, [server, getChannels]);

  if (!server) {
    // If no server selected, we're in "Home" (Direct Messages)
    return (
      <div className="w-64 bg-transparent h-full flex flex-col shrink-0 border-r-[4px] border-black relative z-10 font-['Space_Grotesk']">
        <div className="h-16 border-b-[4px] border-black flex items-center px-6 font-black text-[#1a1a1a] uppercase tracking-tighter text-lg bg-white">
          Direct Messages
        </div>
        <div className="flex-1 p-4">
          <div className="px-4 py-3 bg-[#ffcc00] border-[3px] border-black shadow-[4px_4px_0px_#000] cursor-pointer flex items-center gap-3 text-[#1a1a1a] font-black uppercase text-sm mb-4 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
            <span className="material-symbols-outlined font-black">person</span>
            Friends List
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a] opacity-60 px-2 mb-2">Private Chats</p>
          <div className="space-y-2">
            <div className="p-3 border-2 border-black bg-white opacity-50 cursor-not-allowed italic text-xs font-bold">
              No recent conversations...
            </div>
          </div>
        </div>
        {/* User Profile Area */}
        <div className="p-4 border-t-[4px] border-black bg-white mt-auto shrink-0">
          <div className="flex items-center gap-3 p-2 border-2 border-black bg-[#f5f5f5] shadow-[4px_4px_0px_#000]">
            <img src={authUser?.profilePic || "/default-avatar.png"} className="w-10 h-10 border-2 border-black bg-white object-cover" alt="avatar" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-black text-[#1a1a1a] truncate uppercase tracking-tighter">{authUser?.fullName?.split(" ")[0]}</div>
              <div className="text-[10px] font-black text-green-600 uppercase">● Online</div>
            </div>
            <button onClick={logout} className="p-2 border-2 border-black bg-white hover:bg-red-500 hover:text-white transition-colors">
              <Settings size={16} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const textChannels = activeServerChannels?.filter(c => c.type === 'text') || [];
  const voiceChannels = activeServerChannels?.filter(c => c.type === 'voice') || [];

  return (
    <div className="w-64 bg-transparent h-full flex flex-col shrink-0 border-r-[4px] border-black relative z-10 font-['Space_Grotesk']">
      {/* Server Header */}
      <div className="h-16 border-b-[4px] border-black flex items-center px-6 font-black text-[#1a1a1a] uppercase tracking-tighter text-lg bg-white shadow-sm">
        {server.name}
      </div>

      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {/* Text Channels */}
        <div className="mb-8">
          <div className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-[0.2em] mb-4 px-2 flex justify-between items-center opacity-60">
            TEXT CHANNELS
            <button onClick={() => setIsCreateModalOpen(true)} className="hover:scale-125 transition-transform text-[#1a1a1a]">
              <Plus size={16} strokeWidth={4} />
            </button>
          </div>
          <div className="space-y-1">
            {textChannels.map(channel => (
              <div 
                key={channel._id}
                onClick={() => onSelectChannel(channel._id, 'text')}
                className={`flex items-center gap-3 px-4 py-3 border-2 border-transparent transition-all cursor-pointer font-black uppercase text-xs tracking-tight
                  ${activeChannelId === channel._id 
                    ? 'bg-[#ffcc00] border-black shadow-[4px_4px_0px_#000] text-[#1a1a1a]' 
                    : 'text-[#1a1a1a] hover:bg-white hover:border-black hover:shadow-[3px_3px_0px_#000]'}`}
              >
                <Hash size={16} strokeWidth={4} />
                <span className="truncate">{channel.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Voice Channels */}
        <div>
          <div className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-[0.2em] mb-4 px-2 flex justify-between items-center opacity-60">
            VOICE CHANNELS
            <button onClick={() => setIsCreateModalOpen(true)} className="hover:scale-125 transition-transform text-[#1a1a1a]">
              <Plus size={16} strokeWidth={4} />
            </button>
          </div>
          <div className="space-y-1">
            {voiceChannels.map(channel => (
              <div 
                key={channel._id}
                onClick={() => onSelectChannel(channel._id, 'voice')}
                className={`flex items-center gap-3 px-4 py-3 border-2 border-transparent transition-all cursor-pointer font-black uppercase text-xs tracking-tight
                  ${activeChannelId === channel._id 
                    ? 'bg-[#ffcc00] border-black shadow-[4px_4px_0px_#000] text-[#1a1a1a]' 
                    : 'text-[#1a1a1a] hover:bg-white hover:border-black hover:shadow-[3px_3px_0px_#000]'}`}
              >
                <Volume2 size={16} strokeWidth={4} />
                <span className="truncate">{channel.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Profile Area (Same as above) */}
      <div className="p-4 border-t-[4px] border-black bg-white mt-auto shrink-0">
        <div className="flex items-center gap-3 p-2 border-2 border-black bg-[#f5f5f5] shadow-[4px_4px_0px_#000]">
          <img src={authUser?.profilePic || "/default-avatar.png"} className="w-10 h-10 border-2 border-black bg-white object-cover" alt="avatar" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-black text-[#1a1a1a] truncate">{authUser?.fullName?.split(" ")[0]}</div>
            <div className="text-[10px] font-black text-green-600 uppercase">● Online</div>
          </div>
          <button onClick={logout} className="p-2 border-2 border-black bg-white hover:bg-red-500 hover:text-white transition-colors">
            <Settings size={16} strokeWidth={3} />
          </button>
        </div>
      </div>

      {isCreateModalOpen && <CreateChannelModal serverId={server._id} onClose={() => setIsCreateModalOpen(false)} />}
    </div>
  );
              <span className="truncate">{channel.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* User Profile Area */}
      <div className="h-14 bg-[#232428] flex items-center px-2 gap-2 mt-auto shrink-0">
        <img src={authUser?.profilePic || "/default-avatar.png"} className="w-8 h-8 rounded-full bg-slate-700" alt="avatar" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-slate-200 truncate">{authUser?.fullName?.split(" ")[0]}</div>
          <div className="text-xs text-slate-400 truncate">Online</div>
        </div>
        <button onClick={logout} className="p-1 hover:bg-[#35373c] rounded-md text-slate-400 hover:text-slate-200">
          <Settings size={18} />
        </button>
      </div>

      <CreateChannelModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        serverId={server?._id}
      />
    </div>
  );
};

export default ChannelList;
