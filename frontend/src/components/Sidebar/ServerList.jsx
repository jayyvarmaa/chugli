import { useState } from "react";
import CreateServerModal from "../Modals/CreateServerModal";
import JoinServerModal from "../Modals/JoinServerModal";

function ServerList({ servers = [], activeServerId, onSelectServer }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  return (
    <div className="w-[84px] bg-[#1a1a1a] flex flex-col items-center py-6 gap-4 overflow-y-auto shrink-0 relative z-20 border-r-[4px] border-r-black shadow-[4px_0px_0px_rgba(0,0,0,0.1)]">
      
      {/* Home Button (DMs) */}
      <div className="w-14 h-14 relative group cursor-pointer" onClick={() => onSelectServer(null)}>
        <div className={`w-14 h-14 flex items-center justify-center transition-all duration-100 border-[3px]
          ${activeServerId === null 
            ? "bg-[#ffcc00] border-black translate-x-1 translate-y-1 shadow-none" 
            : "bg-white border-black shadow-[4px_4px_0px_white] hover:bg-[#ffcc00] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1"}`}
        >
          <span className="material-symbols-outlined text-[#1a1a1a] font-black">forum</span>
        </div>
      </div>

      <div className="w-10 h-[3px] bg-white opacity-20 my-1 rounded-full" />

      {/* Servers Map */}
      {servers.map((server) => (
        <div 
          key={server._id} 
          className="w-14 h-14 relative group cursor-pointer"
          onClick={() => onSelectServer(server._id)}
        >
          <div className={`w-14 h-14 flex items-center justify-center font-black text-xl transition-all duration-100 overflow-hidden border-[3px]
            ${activeServerId === server._id 
              ? "bg-[#ffcc00] border-black translate-x-1 translate-y-1 shadow-none" 
              : "bg-white border-black shadow-[4px_4px_0px_white] hover:bg-[#ffcc00] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1"}`}
          >
            {server.icon ? (
              <img src={server.icon} alt={server.name} className="w-full h-full object-cover" />
            ) : (
              server.name.charAt(0).toUpperCase()
            )}
          </div>
          
          {/* Tooltip */}
          <div className="absolute left-[95px] top-1/2 -translate-y-1/2 bg-[#ffcc00] text-black text-xs font-black px-3 py-2 border-2 border-black shadow-[4px_4px_0px_#000] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 uppercase tracking-widest">
            {server.name}
          </div>
        </div>
      ))}

      {/* Add Server Button */}
      <div 
        className="w-14 h-14 relative group cursor-pointer"
        onClick={() => setShowCreateModal(true)}
      >
        <div className="w-14 h-14 bg-[#1a1a1a] border-[3px] border-white flex items-center justify-center text-white hover:bg-[#ffcc00] hover:text-black hover:border-black transition-all duration-100">
          <span className="material-symbols-outlined font-black">add</span>
        </div>
        <div className="absolute left-[95px] top-1/2 -translate-y-1/2 bg-[#ffcc00] text-black text-xs font-black px-3 py-2 border-2 border-black shadow-[4px_4px_0px_#000] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 uppercase tracking-widest">
          Create Server
        </div>
      </div>

      {/* Explore / Join Server Button */}
      <div 
        className="w-14 h-14 relative group cursor-pointer"
        onClick={() => setShowJoinModal(true)}
      >
        <div className="w-14 h-14 bg-[#1a1a1a] border-[3px] border-white flex items-center justify-center text-white hover:bg-[#ffcc00] hover:text-black hover:border-black transition-all duration-100">
          <span className="material-symbols-outlined font-black">explore</span>
        </div>
        <div className="absolute left-[95px] top-1/2 -translate-y-1/2 bg-[#ffcc00] text-black text-xs font-black px-3 py-2 border-2 border-black shadow-[4px_4px_0px_#000] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 uppercase tracking-widest">
          Join Server
        </div>
      </div>

      {showCreateModal && <CreateServerModal onClose={() => setShowCreateModal(false)} />}
      {showJoinModal && <JoinServerModal onClose={() => setShowJoinModal(false)} />}
    </div>
  );
}

export default ServerList;
