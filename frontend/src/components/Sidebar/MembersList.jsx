import { useEffect, useState } from "react";
import { useServerStore } from "../../store/useServerStore";
import { useAuthStore } from "../../store/useAuthStore";

function MembersList({ activeServerId }) {
  const [members, setMembers] = useState([]);
  const { getServerMembers } = useServerStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    if (activeServerId) {
      getServerMembers(activeServerId).then((data) => {
        setMembers(data);
      });
    } else {
      setMembers([]);
    }
  }, [activeServerId, getServerMembers]);

  if (!activeServerId) return null;

  // Split members into Online and Offline
  const onlineMembers = members.filter(m => onlineUsers.includes(m._id));
  const offlineMembers = members.filter(m => !onlineUsers.includes(m._id));

  const renderMember = (member, isOnline) => (
    <div key={member._id} className="flex items-center gap-3 p-3 border-2 border-transparent hover:border-black hover:bg-white hover:shadow-[3px_3px_0px_#000] cursor-pointer mb-2 transition-all font-['Space_Grotesk']">
      <div className="relative w-10 h-10 border-2 border-black rotate-[-2deg] bg-white overflow-hidden">
        <img src={member.profilePic || "/default-avatar.png"} alt={member.fullName} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-black font-black uppercase tracking-tighter truncate text-sm">
          {member.fullName}
        </p>
        <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest leading-none">
          {isOnline ? "● ACTIVE" : "○ COLD"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-64 bg-transparent h-full flex flex-col shrink-0 border-l-[4px] border-black relative z-10 font-['Space_Grotesk']">
      {/* Header */}
      <div className="h-16 border-b-[4px] border-black flex items-center px-6 font-black text-[#1a1a1a] uppercase tracking-tighter text-lg bg-white shadow-sm">
        SQUAD
      </div>

      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {onlineMembers.length > 0 && (
          <div className="mb-8">
            <h3 className="text-[10px] font-black text-black uppercase tracking-[0.2em] mb-4 px-2 opacity-60">
              STREET CRED — {onlineMembers.length}
            </h3>
            {onlineMembers.map(m => renderMember(m, true))}
          </div>
        )}

        {offlineMembers.length > 0 && (
          <div>
            <h3 className="text-[10px] font-black text-black uppercase tracking-[0.2em] mb-4 px-2 opacity-60">
              AWOL — {offlineMembers.length}
            </h3>
            {offlineMembers.map(m => renderMember(m, false))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MembersList;
