import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div
      className="flex justify-between items-center px-6 py-4"
      style={{
        backgroundColor: "#f5f0e8",
        borderBottom: "4px solid #1a1a1a",
      }}
    >
      <div className="flex items-center gap-4">
        {/* AVATAR */}
        <div className="relative w-12 h-12 flex-shrink-0">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="w-full h-full object-cover"
            style={{ border: "2px solid #1a1a1a" }}
          />
          {isOnline && (
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

        {/* USER INFO */}
        <div>
          <h3 className="font-bold" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a", fontSize: "16px" }}>
            {selectedUser.fullName.toUpperCase()}
          </h3>
          <p style={{ fontFamily: "Inter", color: "#1a1a1a", fontSize: "12px", opacity: 0.7 }}>
            {isOnline ? "🟢 ONLINE" : "⚫ OFFLINE"}
          </p>
        </div>
      </div>

      {/* CLOSE BUTTON */}
      <button
        onClick={() => setSelectedUser(null)}
        className="w-10 h-10 flex items-center justify-center transition-all duration-200"
        style={{
          backgroundColor: "#e63b2e",
          border: "2px solid #1a1a1a",
          color: "#ffffff",
          fontFamily: "Space Grotesk",
        }}
        title="Close (Press ESC)"
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "4px 4px 0px rgba(0, 0, 0, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <span className="material-symbols-outlined text-xl">close</span>
      </button>
    </div>
  );
}
export default ChatHeader;
