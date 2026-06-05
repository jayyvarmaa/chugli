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
    <div className="h-screen w-screen flex fixed inset-0 bg-[#313338] text-slate-200 overflow-hidden font-['Inter']">
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
      <div className="flex-1 flex flex-col min-w-0 bg-[#313338]">
        {/* Top Header */}
        <div className="h-12 border-b border-[#1e1f22] shadow-sm flex items-center px-4 font-bold shrink-0">
          {selectedChannel ? (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">tag</span>
              {selectedChannel.name}
            </div>
          ) : selectedUser ? (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">alternate_email</span>
              {selectedUser.fullName}
            </div>
          ) : (
            <div>Friends</div>
          )}
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          {selectedChannel?.type === 'voice' ? (
            <VideoRoom channelId={selectedChannel._id} onLeave={() => setSelectedChannel(null)} />
          ) : (selectedChannel || selectedUser) ? (
            <ChatContainer />
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col text-slate-400">
              <div className="w-64 h-64 bg-[#2b2d31] rounded-full mb-8 flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-8xl text-slate-500">forum</span>
              </div>
              <h2 className="text-xl font-bold text-slate-300">Welcome to Chugli</h2>
              <p className="mt-2 text-sm text-center max-w-md">Select a server and channel on the left, or choose a friend from Direct Messages to start chatting.</p>
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
