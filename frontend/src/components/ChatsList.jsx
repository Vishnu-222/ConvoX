import { useState, useEffect } from "react";
import useChatStore from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import DeleteConversationModal from "./DeleteConversationModal";
import { Trash2 } from "lucide-react";

const ChatsList = () => {
  const {
    chats,
    isUsersLoading,
    getMyChatPartners,
    setSelectedUser,
    onlineUsers,
  } = useChatStore();

  const [conversationToDelete, setConversationToDelete] = useState(null);

  // FETCH EXISTING CHATS
  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  // LOADING STATE
  if (isUsersLoading) {
    return <UsersLoadingSkeleton />;
  }

  // EMPTY STATE
  if (chats.length === 0) {
    return <NoChatsFound />;
  }

  const handleDeleteConversation = (event, partner) => {
    event.stopPropagation();
    setConversationToDelete(partner);
  };

  // CHAT LIST
  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="group flex items-center justify-between gap-2 bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(chat)}
        >
          {/* Existing chat partner information */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative shrink-0">
              <div className="size-12 overflow-hidden rounded-full">
                <img
                  src={chat.profilePic || "/avatar.png"}
                  alt={chat.fullName}
                  className="size-full object-cover"
                />
              </div>

              {/* Show the indicator only when the chat partner is online. */}
              {onlineUsers.includes(chat._id) && (
                <span
                  className="absolute right-0.5 top-0 size-3 rounded-full border-2 border-slate-800 bg-green-500"
                  title="Online"
                />
              )}
            </div>

            <div className="min-w-0">
              <h4 className="truncate font-medium text-slate-200">
                {chat.fullName}
              </h4>

              <p
                className={`text-xs ${
                  onlineUsers.includes(chat._id)
                    ? "text-green-400"
                    : "text-slate-400"
                }`}
              >
                {onlineUsers.includes(chat._id) ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          {/* Delete this conversation for both participants. */}
          <button
            type="button"
            aria-label={`Delete conversation with ${chat.fullName}`}
            title="Delete conversation"
            onClick={(event) => handleDeleteConversation(event, chat)}
            className="shrink-0 rounded-full p-2 text-slate-400 transition-colors outline-none focus:outline-none focus-visible:outline-none active:bg-red-500/10 active:text-red-400 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 sm:hover:bg-red-500/10 sm:hover:text-red-400"
          >
            <Trash2 size={17} />
          </button>
        </div>
      ))}

      <DeleteConversationModal
        partner={conversationToDelete}
        onClose={() => setConversationToDelete(null)}
      />
    </>
  );
};

export default ChatsList;
