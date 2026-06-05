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
    <div key={member._id} className="flex items-center gap-3 p-2 hover:bg-[#35373c] rounded cursor-pointer mb-1 transition-colors">
      <div className="relative w-8 h-8 rounded-full overflow-hidden">
        <img src={member.profilePic || "/default-avatar.png"} alt={member.fullName} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-300 font-medium truncate" style={{ color: isOnline ? '#f2f3f5' : '#80848e' }}>
          {member.fullName}
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-60 bg-[#2b2d31] h-full flex flex-col shrink-0">
      {/* Header */}
      <div className="h-12 border-b border-[#1e1f22] flex items-center px-4 font-bold text-slate-100 shrink-0 shadow-sm">
        Members
      </div>

      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {onlineMembers.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Online — {onlineMembers.length}
            </h3>
            {onlineMembers.map(m => renderMember(m, true))}
          </div>
        )}

        {offlineMembers.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Offline — {offlineMembers.length}
            </h3>
            {offlineMembers.map(m => renderMember(m, false))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MembersList;
