const NoConversationPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6" style={{ backgroundColor: "#f5f0e8" }}>
      <div className="text-center space-y-6">
        {/* ICON BOX */}
        <div
          className="w-24 h-24 mx-auto flex items-center justify-center"
          style={{
            backgroundColor: "#1a1a1a",
            border: "4px solid #1a1a1a",
            marginBottom: "24px",
          }}
        >
          <span className="material-symbols-outlined text-5xl" style={{ color: "#ffcc00" }}>
            chat_bubble
          </span>
        </div>

        {/* HEADING */}
        <h3 className="text-3xl font-bold" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a" }}>
          SELECT A CONVERSATION
        </h3>

        {/* DESCRIPTION */}
        <p
          className="max-w-md mx-auto text-lg"
          style={{
            fontFamily: "Inter",
            color: "#1a1a1a",
            opacity: 0.7,
            lineHeight: "1.6",
          }}
        >
          Choose a contact from the list on the left to start chatting or continue a previous conversation.
        </p>

        {/* HINT BOX */}
        <div
          className="mt-8 p-4 max-w-md mx-auto"
          style={{
            backgroundColor: "#ffffff",
            border: "2px solid #1a1a1a",
            boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p style={{ fontFamily: "Space Grotesk", color: "#1a1a1a", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            💡 TIP
          </p>
          <p style={{ fontFamily: "Inter", color: "#1a1a1a", fontSize: "13px", marginTop: "8px", opacity: 0.8 }}>
            Use the NEW CHAT button at the top to start a conversation with any contact.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoConversationPlaceholder;
