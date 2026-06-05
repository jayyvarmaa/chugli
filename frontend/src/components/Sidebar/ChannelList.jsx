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
      <div className="w-60 bg-[#2b2d31] h-full flex flex-col shrink-0">
        <div className="h-12 border-b border-[#1e1f22] shadow-sm flex items-center px-4 font-bold text-slate-200">
          Direct Messages
        </div>
        <div className="flex-1 p-2 text-slate-400 text-sm">
          {/* DM list would go here */}
          <div className="px-2 py-1.5 hover:bg-[#35373c] rounded-md cursor-pointer flex items-center gap-2 text-slate-300">
            <span className="material-symbols-outlined text-[20px]">person</span>
            Friends
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
      </div>
    );
  }

  const textChannels = activeServerChannels?.filter(c => c.type === 'text') || [];
  const voiceChannels = activeServerChannels?.filter(c => c.type === 'voice') || [];

  return (
    <div className="w-60 bg-[#2b2d31] h-full flex flex-col shrink-0">
      {/* Server Header */}
      <div className="h-12 border-b border-[#1e1f22] shadow-sm flex items-center px-4 font-bold text-slate-200 hover:bg-[#35373c] cursor-pointer transition-colors">
        {server.name}
      </div>

      <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
        {/* Text Channels */}
        <div className="mb-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 px-2 flex justify-between items-center hover:text-slate-300 cursor-pointer group">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-[16px] mr-1">expand_more</span>
              Text Channels
            </div>
            <button onClick={() => setIsCreateModalOpen(true)} className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-slate-200 transition-opacity">
              <Plus size={16} />
            </button>
          </div>
          {textChannels.map(channel => (
            <div 
              key={channel._id}
              onClick={() => onSelectChannel(channel._id, 'text')}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer mb-[2px]
                ${activeChannelId === channel._id ? 'bg-[#404249] text-slate-200' : 'text-slate-400 hover:bg-[#35373c] hover:text-slate-300'}`}
            >
              <Hash size={18} className="text-slate-500" />
              <span className="truncate">{channel.name}</span>
            </div>
          ))}
        </div>

        {/* Voice Channels */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 px-2 flex justify-between items-center hover:text-slate-300 cursor-pointer group">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-[16px] mr-1">expand_more</span>
              Voice Channels
            </div>
            <button onClick={() => setIsCreateModalOpen(true)} className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-slate-200 transition-opacity">
              <Plus size={16} />
            </button>
          </div>
          {voiceChannels.map(channel => (
            <div 
              key={channel._id}
              onClick={() => onSelectChannel(channel._id, 'voice')}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer mb-[2px]
                ${activeChannelId === channel._id ? 'bg-[#404249] text-slate-200' : 'text-slate-400 hover:bg-[#35373c] hover:text-slate-300'}`}
            >
              <Volume2 size={18} className="text-slate-500" />
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
