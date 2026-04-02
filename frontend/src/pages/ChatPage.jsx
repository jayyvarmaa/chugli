import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import { useRef } from "react";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
  const { logout, authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const fileInputRef = useRef(null);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await updateProfile({ profilePic: reader.result });
      } catch (error) {
        console.error("Failed to update profile:", error);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div 
      className="h-screen w-screen flex fixed inset-0" 
      style={{ 
        backgroundColor: "#f5f0e8",
        backgroundImage: `
          repeating-linear-gradient(0deg, rgba(26, 26, 26, 0.03) 0px, rgba(26, 26, 26, 0.03) 1px, transparent 1px, transparent 60px),
          repeating-linear-gradient(90deg, rgba(26, 26, 26, 0.03) 0px, rgba(26, 26, 26, 0.03) 1px, transparent 1px, transparent 60px)
        `,
        backgroundAttachment: "fixed",
        overflow: "hidden",
      }}
    >
      {/* LEFT SIDEBAR - NAVIGATION */}
      <div className="w-24 flex flex-col items-center py-6 gap-6" style={{ backgroundColor: "#1a1a1a", borderRight: "4px solid #1a1a1a" }}>
        {/* CHUGLI LOGO TEXT */}
        <div 
          className="text-center px-2"
          style={{
            fontFamily: "Space Grotesk",
            fontSize: "14px",
            fontWeight: "900",
            color: "#ffcc00",
            letterSpacing: "0.1em",
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            transform: "rotate(180deg)",
            lineHeight: "1.2",
          }}
        >
          CHUGLI
        </div>

        {/* PROFILE PICTURE */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleProfilePicChange}
          accept="image/*"
          hidden
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUpdatingProfile}
          className="w-16 h-16 flex items-center justify-center transition-all duration-200 rounded-full overflow-hidden"
          style={{
            backgroundColor: "#ffffff",
            border: "3px solid #ffcc00",
            color: "#1a1a1a",
            cursor: isUpdatingProfile ? "not-allowed" : "pointer",
            opacity: isUpdatingProfile ? 0.6 : 1,
          }}
          title="Click to change profile picture"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#00cc99";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#ffcc00";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {authUser?.profilePic ? (
            <img 
              src={authUser.profilePic} 
              alt={authUser.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="material-symbols-outlined text-2xl">
              account_circle
            </span>
          )}
        </button>

        {/* USER NAME */}
        <div 
          className="text-center text-xs font-bold"
          style={{
            fontFamily: "Inter",
            color: "#ffffff",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "70px",
            wordBreak: "break-word",
          }}
          title={authUser?.fullName}
        >
          {authUser?.fullName?.split(" ")[0] || "User"}
        </div>

        {/* SPACER */}
        <div className="flex-1" />

        {/* LOGOUT BUTTON */}
        <button
          onClick={logout}
          className="w-16 h-16 flex items-center justify-center transition-all duration-200"
          style={{
            backgroundColor: "#e63b2e",
            border: "2px solid #e63b2e",
            color: "#ffffff",
          }}
          title="Logout"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(0.95)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <span className="material-symbols-outlined text-2xl">
            logout
          </span>
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex">
        {/* LEFT PANEL - CHAT/CONTACT LIST */}
        <div className="w-80 flex flex-col" style={{ borderRight: "2px solid #1a1a1a" }}>
          {/* HEADER */}
          <div className="p-6" style={{ borderBottom: "4px solid #1a1a1a" }}>
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="text-2xl font-bold" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a" }}>
                {activeTab === "chats" ? "MESSAGES" : "CONTACTS"}
              </h2>
              <div style={{ backgroundColor: "#ffcc00", height: "4px", flex: 1 }} />
            </div>

            {/* NEW CHAT BUTTON */}
            <button
              className="w-full py-3 px-4 font-bold transition-all duration-200"
              style={{
                fontFamily: "Space Grotesk",
                backgroundColor: "#ffcc00",
                border: "4px solid #1a1a1a",
                color: "#1a1a1a",
                boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.1)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontSize: "12px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(4px, 4px)";
                e.currentTarget.style.boxShadow = "0px 0px 0px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0, 0)";
                e.currentTarget.style.boxShadow = "4px 4px 0px rgba(0, 0, 0, 0.1)";
              }}
            >
              + NEW CHAT
            </button>
          </div>

          {/* TABS */}
          <div className="p-4" style={{ borderBottom: "2px solid #1a1a1a" }}>
            <ActiveTabSwitch />
          </div>

          {/* LIST CONTENT */}
          <div className="flex-1 overflow-y-auto p-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT PANEL - CHAT AREA OR PLACEHOLDER */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </div>
    </div>
  );
}
export default ChatPage;
