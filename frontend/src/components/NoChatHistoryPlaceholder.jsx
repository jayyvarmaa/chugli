const NoChatHistoryPlaceholder = ({ name, onSendMessage }) => {
  const suggestedMessages = [
    { emoji: "👋", text: "Say Hello" },
    { emoji: "🤝", text: "How are you?" },
    { emoji: "📅", text: "Meet up soon?" },
  ];

  const handleSelectMessage = (message) => {
    if (onSendMessage) {
      onSendMessage(message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6" style={{ backgroundColor: "#f5f0e8" }}>
      {/* ICON */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{
          backgroundColor: "#ffcc00",
          border: "3px solid #1a1a1a",
        }}
      >
        <span style={{ fontSize: "32px" }}>💬</span>
      </div>

      {/* TITLE */}
      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "Space Grotesk", color: "#1a1a1a" }}>
        Start your conversation with {name}
      </h3>

      {/* SUBTITLE */}
      <p
        className="text-sm mb-8"
        style={{
          fontFamily: "Inter",
          color: "#1a1a1a",
          opacity: 0.6,
          maxWidth: "300px",
        }}
      >
        This is the beginning of your conversation. Send a message to start chatting!
      </p>

      {/* SUGGESTED MESSAGES */}
      <div className="flex flex-wrap gap-3 justify-center">
        {suggestedMessages.map((item, index) => (
          <button
            key={index}
            onClick={() => handleSelectMessage(`${item.emoji} ${item.text}`)}
            style={{
              backgroundColor: "#ffffff",
              border: "2px solid #1a1a1a",
              color: "#1a1a1a",
              fontFamily: "Inter",
              fontSize: "13px",
              fontWeight: "600",
              padding: "10px 16px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#ffcc00";
              e.currentTarget.style.boxShadow = "3px 3px 0px rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {item.emoji} {item.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;
