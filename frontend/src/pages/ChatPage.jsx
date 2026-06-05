import { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useServerStore } from "../store/useServerStore";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import ServerList from "../components/Sidebar/ServerList";
import ChannelList from "../components/Sidebar/ChannelList";
import MembersList from "../components/Sidebar/MembersList";
import VideoRoom from "../components/VideoRoom";

function ChatPage() {
  const { selectedUser, getMyChatPartners, stopPollingMessages, selectedChannel, setSelectedChannel } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const { servers, getServers, activeServerChannels } = useServerStore();
  
  // State for Discord-like navigation
  const [activeServerId, setActiveServerId] = useState(null);

  // Use real server data if active
  const activeServerData = servers.find(s => s._id === activeServerId);

  const handleSelectServer = (serverId) => {
    setActiveServerId(serverId);
    setSelectedChannel(null); // Clear channel
  };

  const handleSelectChannel = (channelId, type) => {
    const channel = activeServerChannels.find(c => c._id === channelId);
    setSelectedChannel(channel);
  };

  useEffect(() => {
    getServers();
    getMyChatPartners();
    const chatListInterval = setInterval(() => {
      const { getMyChatPartnersBackground } = useChatStore.getState();
      getMyChatPartnersBackground();
    }, 1000);

    return () => {
      clearInterval(chatListInterval);
      stopPollingMessages();
    };
  }, [getMyChatPartners, stopPollingMessages]);

  return (
    <div className="h-screen w-screen flex fixed inset-0 bg-[#f5f0e8] text-[#1a1a1a] overflow-hidden font-['Space_Grotesk']">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }}></div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: `radial-gradient(#1a1a1a 0.5px, transparent 0.5px)`, backgroundSize: "20px 20px" }}></div>

      {/* 1. Far Left - Server List */}
      <ServerList 
        servers={servers}
        activeServerId={activeServerId}
        onSelectServer={handleSelectServer}
      />

      {/* 2. Secondary Left - Channel / DM List */}
      <ChannelList 
        server={activeServerId ? activeServerData : null}
        activeChannelId={selectedChannel?._id}
        onSelectChannel={handleSelectChannel}
      />

      {/* 3. Center - Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10">
        {/* Top Header */}
        <div className="h-16 border-b-[4px] border-[#1a1a1a] flex items-center px-6 font-black shrink-0 uppercase tracking-tighter text-xl">
          {selectedChannel ? (
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1a1a1a]">#</span>
              {selectedChannel.name}
            </div>
          ) : selectedUser ? (
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1a1a1a]">@</span>
              {selectedUser.fullName}
            </div>
          ) : (
            <div>Dashboard</div>
          )}
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          {selectedChannel?.type === 'voice' ? (
            <VideoRoom channelId={selectedChannel._id} onLeave={() => setSelectedChannel(null)} />
          ) : (selectedChannel || selectedUser) ? (
            <ChatContainer />
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col text-[#1a1a1a] p-8">
              <div className="w-64 h-64 bg-[#ffcc00] border-[4px] border-[#1a1a1a] shadow-[8px_8px_0px_#1a1a1a] mb-12 flex items-center justify-center rotate-3">
                <span className="material-symbols-outlined text-8xl">forum</span>
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Select a Channel</h2>
              <p className="text-lg font-bold text-center max-w-md border-2 border-[#1a1a1a] p-4 bg-white shadow-[4px_4px_0px_#1a1a1a]">
                CHOOSE A SERVER FROM THE LEFT SIDEBAR TO START THE SHIT-TALK.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Far Right - Members List (Only show if a server/channel is selected) */}
      {activeServerId && (
        <MembersList activeServerId={activeServerId} />
      )}
    </div>
  );
}

export default ChatPage;
