import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="flex gap-2">
      {[
        { id: "chats", label: "CHATS", icon: "chat_bubble" },
        { id: "contacts", label: "CONTACTS", icon: "people" },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className="flex-1 py-3 px-3 font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            fontFamily: "Space Grotesk",
            backgroundColor: activeTab === tab.id ? "#ffcc00" : "#ffffff",
            border: "2px solid #1a1a1a",
            color: "#1a1a1a",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontSize: "12px",
            boxShadow: activeTab === tab.id ? "2px 2px 0px rgba(0, 0, 0, 0.1)" : "none",
          }}
          onMouseEnter={(e) => {
            if (activeTab !== tab.id) {
              e.currentTarget.style.backgroundColor = "#f0f0f0";
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== tab.id) {
              e.currentTarget.style.backgroundColor = "#ffffff";
            }
          }}
        >
          <span className="material-symbols-outlined text-base">
            {tab.icon}
          </span>
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
export default ActiveTabSwitch;
