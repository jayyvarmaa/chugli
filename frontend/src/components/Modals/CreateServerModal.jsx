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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#313338] rounded-xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Customize your server</h2>
          <p className="text-slate-300 text-sm">
            Give your new server a personality with a name and an icon. You can always change it later.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-0 flex flex-col gap-6">
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
                className={`w-24 h-24 rounded-full border-2 border-dashed flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-colors
                  ${iconPreview ? 'border-transparent' : 'border-slate-500 hover:border-slate-300'}`}
              >
                {iconPreview ? (
                  <img src={iconPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload size={24} className="text-slate-400 group-hover:text-slate-200" />
                    <span className="text-xs text-slate-400 group-hover:text-slate-200 mt-1 font-bold">UPLOAD</span>
                  </>
                )}
              </label>
              {iconPreview && (
                <div className="absolute top-0 right-0 bg-indigo-500 text-white rounded-full p-1 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                </div>
              )}
            </div>
          </div>

          {/* Server Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Server Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1e1f22] border-none rounded-md px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="My Awesome Server"
              maxLength={100}
              autoFocus
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
