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
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    // clean up
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
