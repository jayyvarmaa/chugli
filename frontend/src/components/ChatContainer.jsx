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
    <div className="h-full flex flex-col bg-[#313338]">
      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {/* Welcome Header at the top of empty chat */}
        <div className="mt-auto mb-6">
          <div className="w-16 h-16 bg-[#404249] rounded-full flex items-center justify-center mb-4">
            {selectedChannel ? (
              <Hash size={32} className="text-slate-200" />
            ) : (
              <img src={selectedUser?.profilePic || "/default-avatar.png"} alt="avatar" className="w-full h-full rounded-full object-cover" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            {selectedChannel ? `Welcome to #${targetName}!` : targetName}
          </h1>
          <p className="text-slate-400">
            {selectedChannel 
              ? "This is the start of the channel." 
              : `This is the beginning of your direct message history with ${targetName}.`}
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
                <div key={msg._id} className={`flex gap-4 hover:bg-[#2e3035] p-2 rounded-md ${!isSameUser ? 'mt-2' : '-mt-3'}`}>
                  {/* Avatar */}
                  {!isSameUser ? (
                    <img src={senderPic} alt="avatar" className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-80 mt-1" />
                  ) : (
                    <div className="w-10 h-10 flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    {/* Header (only show if not same user as previous msg) */}
                    {!isSameUser && (
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-medium text-slate-100 hover:underline cursor-pointer">
                          {senderName}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    
                    {/* Text Content */}
                    {msg.text && (
                      <p className="text-slate-200 break-words whitespace-pre-wrap">{msg.text}</p>
                    )}

                    {/* Image Content */}
                    {msg.image && (
                      <img 
                        src={msg.image} 
                        alt="attachment" 
                        className="max-w-sm max-h-80 rounded-md mt-2 object-contain bg-[#2b2d31]"
                      />
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
