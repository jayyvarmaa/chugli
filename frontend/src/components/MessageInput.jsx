import { useRef, useState } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  const { sendMessage, isSoundEnabled } = useChatStore();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();

    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });
    setText("");
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Check file size - 100MB limit
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Image must be less than 100MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      toast.success("Image ready to send");
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4" style={{ backgroundColor: "#f5f0e8", borderTop: "4px solid #1a1a1a" }}>
      {/* IMAGE PREVIEW */}
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-4 flex items-center gap-3">
          <div className="relative w-20 h-20 flex-shrink-0">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
              style={{ border: "2px solid #1a1a1a" }}
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all"
              type="button"
              style={{
                backgroundColor: "#e63b2e",
                border: "2px solid #1a1a1a",
                color: "#ffffff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <p style={{ fontFamily: "Inter", color: "#1a1a1a", fontSize: "12px", opacity: 0.7 }}>
            Image ready to send
          </p>
        </div>
      )}

      {/* MESSAGE INPUT FORM */}
      <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex gap-3">
        {/* TEXT INPUT */}
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            isSoundEnabled && playRandomKeyStrokeSound();
          }}
          className="flex-1 px-4 py-3"
          style={{
            fontFamily: "Inter",
            backgroundColor: "#ffffff",
            border: "2px solid #1a1a1a",
            color: "#1a1a1a",
            boxShadow: "2px 2px 0px rgba(0, 0, 0, 0.1)",
          }}
          placeholder="Type your message..."
        />

        {/* HIDDEN FILE INPUT */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        {/* IMAGE ATTACHMENT BUTTON */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-12 h-12 flex items-center justify-center transition-all duration-200"
          style={{
            backgroundColor: imagePreview ? "#0055ff" : "#ffffff",
            border: "2px solid #1a1a1a",
            color: imagePreview ? "#ffffff" : "#1a1a1a",
            boxShadow: "2px 2px 0px rgba(0, 0, 0, 0.1)",
          }}
          title="Attach image"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#0055ff";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = imagePreview ? "#0055ff" : "#ffffff";
            e.currentTarget.style.color = imagePreview ? "#ffffff" : "#1a1a1a";
          }}
        >
          <span className="material-symbols-outlined text-xl">image</span>
        </button>

        {/* SEND BUTTON */}
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="w-12 h-12 flex items-center justify-center font-bold transition-all duration-200"
          style={{
            fontFamily: "Space Grotesk",
            backgroundColor: !text.trim() && !imagePreview ? "#cccccc" : "#ffcc00",
            border: "2px solid #1a1a1a",
            color: "#1a1a1a",
            boxShadow: "2px 2px 0px rgba(0, 0, 0, 0.1)",
            cursor: !text.trim() && !imagePreview ? "not-allowed" : "pointer",
            opacity: !text.trim() && !imagePreview ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!(!text.trim() && !imagePreview)) {
              e.currentTarget.style.transform = "translate(2px, 2px)";
              e.currentTarget.style.boxShadow = "0px 0px 0px rgba(0, 0, 0, 0.1)";
            }
          }}
          onMouseLeave={(e) => {
            if (!(!text.trim() && !imagePreview)) {
              e.currentTarget.style.transform = "translate(0, 0)";
              e.currentTarget.style.boxShadow = "2px 2px 0px rgba(0, 0, 0, 0.1)";
            }
          }}
          title="Send message (Enter)"
        >
          <span className="material-symbols-outlined text-xl">send</span>
        </button>
      </form>
    </div>
  );
}
export default MessageInput;
