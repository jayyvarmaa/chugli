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
    <div className="p-4 bg-transparent relative z-20">
      {/* IMAGE PREVIEW */}
      {imagePreview && (
        <div className="mb-4 bg-white p-4 border-[3px] border-black shadow-[4px_4px_0px_#000] flex items-start w-max relative rotate-[-1deg]">
          <div className="relative w-48 h-48 flex-shrink-0 border-2 border-black overflow-hidden bg-white">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={removeImage}
              className="absolute top-1 right-1 bg-black text-white p-1 hover:bg-red-500 transition-colors border-2 border-white"
              type="button"
            >
              <X size={16} strokeWidth={4} />
            </button>
          </div>
        </div>
      )}

      {/* MESSAGE INPUT FORM */}
      <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
        <div className="flex gap-4 items-center bg-white border-[4px] border-black p-2 shadow-[6px_6px_0px_#1a1a1a] focus-within:shadow-none focus-within:translate-x-1 focus-within:translate-y-1 transition-all">
          {/* ADD MEDIA BUTTON */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-[#1a1a1a] hover:bg-[#ffcc00] border-2 border-transparent hover:border-black transition-all"
            title="Attach image"
          >
            <PlusCircle size={24} strokeWidth={3} />
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
            className="flex-1 bg-transparent border-none text-[#1a1a1a] font-black focus:outline-none py-3 placeholder:text-[#1a1a1a]/40 uppercase tracking-tighter"
            placeholder={selectedChannel ? `MESSAGE #${selectedChannel.name.toUpperCase()}` : `MESSAGE @${selectedUser?.fullName?.toUpperCase()}`}
          />

          {/* SEND BUTTON */}
          <button
            type="submit"
            disabled={!text.trim() && !imagePreview}
            className="bg-[#ffcc00] text-[#1a1a1a] px-6 py-3 border-[3px] border-black font-black uppercase tracking-widest text-sm shadow-[3px_3px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-50 disabled:grayscale transition-all flex items-center gap-2"
            title="Send message"
          >
            SEND
            <Send size={18} strokeWidth={3} />
          </button>
        </div>
        <p className="text-[9px] font-black uppercase tracking-widest text-[#1a1a1a]/40 px-2 italic">
          KEEP IT RAW • VINTAGE CHUGLI v1.0
        </p>
      </form>
    </div>
  );
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
export default MessageInput;
