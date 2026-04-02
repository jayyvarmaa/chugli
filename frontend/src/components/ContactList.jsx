import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          onClick={() => setSelectedUser(contact)}
          className="p-4 cursor-pointer transition-all duration-200 transform hover:scale-105"
          style={{
            backgroundColor: "#ffffff",
            border: "2px solid #1a1a1a",
            marginBottom: "8px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#0055ff";
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.boxShadow = "4px 4px 0px rgba(0, 0, 0, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.color = "#1a1a1a";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div className="flex items-center gap-3">
            {/* AVATAR WITH ONLINE STATUS */}
            <div className="relative w-12 h-12 flex-shrink-0">
              <img
                src={contact.profilePic || "/avatar.png"}
                alt={contact.fullName}
                className="w-full h-full object-cover"
                style={{ border: "2px solid #1a1a1a" }}
              />
              {onlineUsers.includes(contact._id) && (
                <div
                  className="absolute bottom-0 right-0 w-4 h-4"
                  style={{
                    backgroundColor: "#ffcc00",
                    border: "2px solid #ffffff",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>

            {/* CONTACT INFO */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate" style={{ fontFamily: "Space Grotesk", fontSize: "14px" }}>
                {contact.fullName}
              </h4>
              <p style={{ fontFamily: "Inter", fontSize: "12px", opacity: 0.7 }}>
                {onlineUsers.includes(contact._id) ? "🟢 ONLINE" : "⚫ OFFLINE"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
export default ContactList;
