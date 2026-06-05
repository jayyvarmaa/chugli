import { useState } from "react";
import CreateServerModal from "../Modals/CreateServerModal";
import JoinServerModal from "../Modals/JoinServerModal";

function ServerList({ servers = [], activeServerId, onSelectServer }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  return (
    <div className="w-[72px] bg-[#1e1f22] flex flex-col items-center py-3 gap-2 overflow-y-auto shrink-0 relative pt-16 z-10">
      
      {/* Home Button (DMs) */}
      <div className="w-12 h-12 relative group cursor-pointer" onClick={() => onSelectServer(null)}>
        <div className={`absolute -left-3 top-1/2 -translate-y-1/2 w-1 bg-white rounded-r-md transition-all duration-200 
          ${activeServerId === null ? "h-10" : "h-0 group-hover:h-5"}`} 
        />
        <div className={`w-12 h-12 flex items-center justify-center transition-all duration-200
          ${activeServerId === null 
            ? "bg-[#5865F2] rounded-[16px] text-white" 
            : "bg-[#313338] rounded-[24px] group-hover:rounded-[16px] group-hover:bg-[#5865F2] text-slate-300 group-hover:text-white"}`}
        >
          <span className="material-symbols-outlined">forum</span>
        </div>
      </div>

      <div className="w-8 h-[2px] bg-[#313338] rounded-full mx-auto my-1" />

      {/* Servers Map */}
      {servers.map((server) => (
        <div 
          key={server._id} 
          className="w-12 h-12 relative group cursor-pointer"
          onClick={() => onSelectServer(server._id)}
        >
          <div className={`absolute -left-3 top-1/2 -translate-y-1/2 w-1 bg-white rounded-r-md transition-all duration-200 
            ${activeServerId === server._id ? "h-10" : "h-0 group-hover:h-5"}`} 
          />
          <div className={`w-12 h-12 flex items-center justify-center font-bold text-lg transition-all duration-200 overflow-hidden
            ${activeServerId === server._id 
              ? "bg-[#5865F2] rounded-[16px] text-white" 
              : "bg-[#313338] rounded-[24px] group-hover:rounded-[16px] group-hover:bg-[#5865F2] text-slate-300 group-hover:text-white"}`}
          >
            {server.icon ? (
              <img src={server.icon} alt={server.name} className="w-full h-full object-cover" />
            ) : (
              server.name.charAt(0).toUpperCase()
            )}
          </div>
          
          {/* Tooltip */}
          <div className="absolute left-[80px] top-1/2 -translate-y-1/2 bg-black text-slate-200 text-sm font-bold px-3 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50">
            {server.name}
          </div>
        </div>
      ))}

      {/* Add Server Button */}
      <div 
        className="w-12 h-12 relative group cursor-pointer mt-2"
        onClick={() => setShowCreateModal(true)}
      >
        <div className="w-12 h-12 bg-[#313338] rounded-[24px] group-hover:rounded-[16px] group-hover:bg-[#23a559] flex items-center justify-center text-[#23a559] group-hover:text-white transition-all duration-200">
          <span className="material-symbols-outlined">add</span>
        </div>
        <div className="absolute left-[80px] top-1/2 -translate-y-1/2 bg-black text-slate-200 text-sm font-bold px-3 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50">
          Add a Server
        </div>
      </div>

      {/* Explore / Join Server Button */}
      <div 
        className="w-12 h-12 relative group cursor-pointer mt-1"
        onClick={() => setShowJoinModal(true)}
      >
        <div className="w-12 h-12 bg-[#313338] rounded-[24px] group-hover:rounded-[16px] group-hover:bg-[#23a559] flex items-center justify-center text-[#23a559] group-hover:text-white transition-all duration-200">
          <span className="material-symbols-outlined">explore</span>
        </div>
        <div className="absolute left-[80px] top-1/2 -translate-y-1/2 bg-black text-slate-200 text-sm font-bold px-3 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50">
          Explore Public Servers
        </div>
      </div>

      {showCreateModal && <CreateServerModal onClose={() => setShowCreateModal(false)} />}
      {showJoinModal && <JoinServerModal onClose={() => setShowJoinModal(false)} />}
    </div>
  );
}

export default ServerList;
