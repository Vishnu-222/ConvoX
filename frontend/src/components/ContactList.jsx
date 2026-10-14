import { useEffect } from "react";
import useChatStore from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";

const ContactList = () => {
  const {
    allContacts,
    isUsersLoading,
    getAllContacts,
    setSelectedUser,
    onlineUsers,
  } = useChatStore();

  // FETCH ALL CONTACTS
  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  // LOADING STATE
  if (isUsersLoading) {
    return <UsersLoadingSkeleton />;
  }

  // CONTACT LIST
  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="size-12 overflow-hidden rounded-full">
                <img
                  src={contact.profilePic || "/avatar.png"}
                  alt={contact.fullName}
                  className="size-full object-cover"
                />
              </div>

              {/* Show the green indicator only when the contact is online. */}
              {onlineUsers.includes(contact._id) && (
                <span
                  className="absolute right-0.5 top-0 size-3 rounded-full border-2 border-slate-800 bg-green-500"
                  title="Online"
                />
              )}
            </div>

            <div className="min-w-0">
              <h4 className="truncate font-medium text-slate-200">
                {contact.fullName}
              </h4>
              <p
                className={`text-xs ${
                  onlineUsers.includes(contact._id)
                    ? "text-green-400"
                    : "text-slate-400"
                }`}
              >
                {onlineUsers.includes(contact._id) ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ContactList;
