import { useState } from "react";
import { useServerStore } from "../../store/useServerStore";
import { X, Upload } from "lucide-react";

const CreateServerModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [iconPreview, setIconPreview] = useState(null);
  const { createServer, isCreatingServer } = useServerStore();

  if (!isOpen) return null;

  const handleIconChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setIconPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const server = await createServer({ 
      name: name.trim(),
      icon: iconPreview 
    });

    if (server) {
      setName("");
      setIconPreview(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 font-['Space_Grotesk']">
      <div className="bg-white border-[4px] border-black p-8 w-full max-w-md shadow-[12px_12px_0px_#ffcc00] rotate-1 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:rotate-90 transition-transform"
        >
          <X size={28} strokeWidth={4} />
        </button>

        <div className="mb-8 border-b-[4px] border-black pb-4 text-center">
          <h2 className="text-4xl font-black text-black uppercase tracking-tighter">BRAND YOUR SQUAD</h2>
          <p className="text-xs font-black uppercase text-black/50 tracking-widest mt-1">
            GIVE YOUR SERVER A FACE AND A NAME
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Icon Upload */}
          <div className="flex justify-center">
            <div className="relative group cursor-pointer">
              <input 
                type="file" 
                className="hidden" 
                id="server-icon"
                accept="image/*"
                onChange={handleIconChange}
              />
              <label 
                htmlFor="server-icon"
                className={`w-28 h-28 border-[3px] flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all rotate-[-3deg] shadow-[6px_6px_0px_#1a1a1a]
                  ${iconPreview ? 'border-black' : 'border-black border-dashed bg-[#f5f5f5] hover:bg-[#ffcc00]'}`}
              >
                {iconPreview ? (
                  <img src={iconPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload size={32} strokeWidth={3} className="text-black" />
                    <span className="text-[10px] text-black mt-1 font-black uppercase tracking-widest">UPLOAD LOGO</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Server Name */}
          <div>
            <label className="block text-xs font-black text-black uppercase tracking-widest mb-3 opacity-60">
              SQUAD NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="THE ELITE SHIT-TALKERS"
              maxLength={100}
              autoFocus
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 border-[3px] border-black font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_#ccc]"
            >
              RETREAT
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isCreatingServer || !name.trim()}
              className="flex-1 py-4 bg-[#ffcc00] border-[3px] border-black font-black uppercase tracking-widest text-sm shadow-[6px_6px_0px_#1a1a1a] active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-50 disabled:grayscale transition-all"
            >
              {isCreatingServer ? "MINING..." : "DEPLOY"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
            />
          </div>
        </form>

        <div className="bg-[#2b2d31] p-4 flex justify-between items-center mt-auto">
          <button 
            type="button"
            onClick={onClose}
            className="text-sm text-slate-300 hover:underline px-4 py-2"
          >
            Back
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isCreatingServer || !name.trim()}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
          >
            {isCreatingServer ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Creating...
              </>
            ) : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateServerModal;
