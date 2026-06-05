import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import { Hash, User } from "lucide-react";

function ChatContainer() {
  const {
    selectedUser,
    selectedChannel,
    getMessagesByUserId,
    getMessagesByChannelId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    subscribeToChannelMessages,
    unsubscribeFromChannelMessages,
    isTyping,
    markMessagesAsRead,
  } = useChatStore();
  
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedChannel) {
      getMessagesByChannelId(selectedChannel._id);
      subscribeToChannelMessages(selectedChannel._id);
      
      const socket = useAuthStore.getState().socket;
      socket.emit("openChat", selectedChannel._id);

      return () => {
        unsubscribeFromChannelMessages();
        socket.emit("closeChat", selectedChannel._id);
      };
    } else if (selectedUser) {
      getMessagesByUserId(selectedUser._id);
      markMessagesAsRead(selectedUser._id);
      subscribeToMessages();
      
      const socket = useAuthStore.getState().socket;
      socket.emit("openChat", selectedUser._id);

      const { startPollingMessages } = useChatStore.getState();
      startPollingMessages();

      return () => {
        unsubscribeFromMessages();
        socket.emit("closeChat", selectedUser._id);
        const { stopPollingMessages } = useChatStore.getState();
        stopPollingMessages();
      };
    }
  }, [selectedUser, selectedChannel, getMessagesByUserId, getMessagesByChannelId, subscribeToMessages, unsubscribeFromMessages, subscribeToChannelMessages, unsubscribeFromChannelMessages, markMessagesAsRead]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const targetName = selectedChannel ? selectedChannel.name : selectedUser?.fullName;

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col no-scrollbar">
        {/* Welcome Header at the top of empty chat */}
        <div className="mt-auto mb-8 p-8 border-[4px] border-black bg-white shadow-[8px_8px_0px_#1a1a1a] max-w-2xl">
          <div className="w-20 h-20 bg-[#ffcc00] border-[3px] border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_#000]">
            {selectedChannel ? (
              <Hash size={40} className="text-black" strokeWidth={3} />
            ) : (
              <img src={selectedUser?.profilePic || "/default-avatar.png"} alt="avatar" className="w-full h-full object-cover" />
            )}
          </div>
          <h1 className="text-4xl font-black text-[#1a1a1a] mb-2 uppercase tracking-tighter">
            {selectedChannel ? `CHANNEL: #${targetName}` : `DM: ${targetName}`}
          </h1>
          <p className="text-lg font-bold text-[#1a1a1a] opacity-70 uppercase tracking-tight">
            {selectedChannel 
              ? "THIS IS THE START OF THE CHAOS. POST SOMETHING WORTHY." 
              : `NO MERCY IN THE CHAT WITH ${targetName}. START TYPING.`}
          </p>
        </div>

        {/* Message List */}
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg, idx) => {
              // Group messages by same user if within a short time (basic logic)
              const prevMsg = messages[idx - 1];
              const isSameUser = prevMsg && 
                (msg.senderId?._id || msg.senderId) === (prevMsg.senderId?._id || prevMsg.senderId);
              
              const senderPic = msg.senderId?.profilePic || "/default-avatar.png";
              const senderName = msg.senderId?.fullName || "User";

              return (
                <div key={msg._id} className={`flex gap-4 p-2 transition-colors ${!isSameUser ? 'mt-4' : 'mt-1'} group`}>
                  {/* Avatar */}
                  {!isSameUser ? (
                    <div className="w-12 h-12 flex-shrink-0 border-2 border-black shadow-[3px_3px_0px_#000] rotate-[-2deg] bg-white overflow-hidden">
                      <img src={senderPic} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    {/* Header (only show if not same user as previous msg) */}
                    {!isSameUser && (
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="font-black text-[#1a1a1a] uppercase tracking-tighter text-sm">
                          {senderName}
                        </span>
                        <span className="text-[10px] font-bold text-[#1a1a1a] opacity-50 uppercase tracking-widest">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    
                    {/* Text Content */}
                    {msg.text && (
                      <div className={`text-[#1a1a1a] font-bold break-words whitespace-pre-wrap leading-tight
                        ${msg.senderId?._id === authUser._id || msg.senderId === authUser._id ? 'bg-[#ffcc00] border-2 border-black p-2 shadow-[3px_3px_0px_#000] inline-block' : ''}`}>
                        {msg.text}
                      </div>
                    )}

                    {/* Image Content */}
                    {msg.image && (
                      <div className="mt-2 border-[3px] border-black inline-block bg-black shadow-[4px_4px_0px_white]">
                        <img 
                          src={msg.image} 
                          alt="attachment" 
                          className="max-w-sm max-h-80 object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-sm text-slate-400 p-2">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                </span>
                Someone is typing...
              </div>
            )}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer;
