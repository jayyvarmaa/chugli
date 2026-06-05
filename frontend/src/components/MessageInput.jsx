import { useRef, useState, useEffect } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { PlusCircle, Send, Image as ImageIcon, X } from "lucide-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const fileInputRef = useRef(null);

  const { sendMessage, sendChannelMessage, selectedChannel, selectedUser, isSoundEnabled, sendTypingIndicator } = useChatStore();

  const handleTyping = (e) => {
    const value = e.target.value;
    setText(value);
    isSoundEnabled && playRandomKeyStrokeSound();

    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      sendTypingIndicator(true, selectedChannel?._id);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingIndicator(false, selectedChannel?._id);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();

    const messageData = {
      text: text.trim(),
      image: imagePreview,
    };

    if (selectedChannel) {
      sendChannelMessage(selectedChannel._id, messageData);
    } else if (selectedUser) {
      sendMessage(messageData);
    }

    setText("");
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

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
    <div className="p-4 bg-[#313338]">
      {/* IMAGE PREVIEW */}
      {imagePreview && (
        <div className="mb-2 bg-[#2b2d31] p-3 rounded-md flex items-start w-max relative border border-[#1e1f22]">
          <div className="relative w-40 h-40 flex-shrink-0 rounded overflow-hidden">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={removeImage}
              className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 rounded p-1 text-white transition-colors"
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* MESSAGE INPUT FORM */}
      <form onSubmit={handleSendMessage} className="bg-[#383a40] rounded-lg flex items-center pr-2">
        {/* ADD MEDIA BUTTON */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-slate-400 hover:text-slate-200 transition-colors"
          title="Attach image"
        >
          <PlusCircle size={24} className="fill-slate-400/20" />
        </button>

        {/* HIDDEN FILE INPUT */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        {/* TEXT INPUT */}
        <input
          type="text"
          value={text}
          onChange={handleTyping}
          className="flex-1 bg-transparent border-none text-slate-200 focus:outline-none py-3 placeholder:text-slate-500"
          placeholder={selectedChannel ? `Message #${selectedChannel.name}` : `Message @${selectedUser?.fullName}`}
        />

        {/* SEND BUTTON */}
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className={`p-2 rounded-md flex items-center justify-center transition-colors ml-2
            ${(!text.trim() && !imagePreview) 
              ? "text-slate-500 cursor-not-allowed" 
              : "text-indigo-400 hover:text-indigo-300 hover:bg-[#404249]"}`}
          title="Send message (Enter)"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
export default MessageInput;
