import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => setSelectedUser(chat)}
          className="p-4 cursor-pointer transition-all duration-200 transform hover:scale-105"
          style={{
            backgroundColor: "#ffffff",
            border: "2px solid #1a1a1a",
            marginBottom: "8px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#ffcc00";
            e.currentTarget.style.boxShadow = "4px 4px 0px rgba(0, 0, 0, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div className="flex items-center gap-3">
            {/* AVATAR WITH ONLINE STATUS */}
            <div className="relative w-12 h-12 flex-shrink-0">
              <img
                src={chat.profilePic || "/avatar.png"}
                alt={chat.fullName}
                className="w-full h-full object-cover"
                style={{ border: "2px solid #1a1a1a" }}
              />
              {onlineUsers.includes(chat._id) && (
                <div
                  className="absolute bottom-0 right-0 w-4 h-4"
                  style={{
                    backgroundColor: "#0055ff",
                    border: "2px solid #ffffff",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>

            {/* CHAT INFO */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a", fontSize: "14px" }}>
                {chat.fullName}
              </h4>
              <p style={{ fontFamily: "Inter", color: "#1a1a1a", fontSize: "12px", opacity: 0.6 }}>
                {onlineUsers.includes(chat._id) ? "ONLINE" : "OFFLINE"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
export default ChatsList;
