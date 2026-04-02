import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    isTyping,
    markMessagesAsRead,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    markMessagesAsRead(selectedUser._id); // Mark messages as read when opening chat
    subscribeToMessages();

    // clean up
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages, markMessagesAsRead]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]); // Also scroll when typing indicator appears/disappears

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: "#f5f0e8" }}>
      <ChatHeader />

      {/* MESSAGES AREA */}
      <div className="flex-1 px-6 overflow-y-auto py-8" style={{ borderTop: "2px solid #1a1a1a" }}>
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.senderId === authUser._id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-xs px-4 py-3"
                  style={{
                    backgroundColor: msg.senderId === authUser._id ? "#ffcc00" : "#ffffff",
                    border: "2px solid #1a1a1a",
                    boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.1)",
                    color: "#1a1a1a",
                    fontFamily: "Inter",
                    position: "relative",
                  }}
                >
                  {/* IMAGE IF EXISTS */}
                  {msg.image && (
                    <div className="mb-2">
                      <img
                        src={msg.image}
                        alt="Shared"
                        className="max-w-xs h-auto"
                        style={{ border: "2px solid #1a1a1a" }}
                      />
                    </div>
                  )}

                  {/* MESSAGE TEXT */}
                  {msg.text && (
                    <p style={{ fontFamily: "Inter", fontSize: "14px", lineHeight: "1.5" }}>
                      {msg.text}
                    </p>
                  )}

                  {/* TIMESTAMP */}
                  <p
                    style={{
                      fontFamily: "Inter",
                      fontSize: "11px",
                      marginTop: "6px",
                      opacity: 0.7,
                    }}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div
                  className="px-4 py-3 flex items-center gap-2"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "2px solid #1a1a1a",
                    boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <span style={{ fontFamily: "Inter", fontSize: "12px", color: "#1a1a1a" }}>
                    {selectedUser.fullName} is typing
                  </span>
                  <span className="flex gap-1">
                    <span
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ backgroundColor: "#1a1a1a", animationDelay: "0s" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ backgroundColor: "#1a1a1a", animationDelay: "0.1s" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ backgroundColor: "#1a1a1a", animationDelay: "0.2s" }}
                    />
                  </span>
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer;
