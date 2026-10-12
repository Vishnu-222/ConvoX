import { useEffect } from "react";
import useChatStore from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";

const ChatsList = () => {
  const { chats, isUsersLoading, getMyChatPartners, setSelectedUser } = useChatStore();

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

  // CHAT LIST
  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="size-12 overflow-hidden rounded-full">
                <img
                  src={chat.profilePic || "/avatar.png"}
                  alt={chat.fullName}
                  className="size-full object-cover"
                />
              </div>

              {/* Temporary status indicator until Socket.io */}
              <span
                className="absolute right-0.5 top-0 size-3 rounded-full border-2 border-slate-800 bg-green-500"
                title="Online status placeholder"
              />
            </div>

            <div className="min-w-0">
              <h4 className="truncate font-medium text-slate-200">
                {chat.fullName}
              </h4>
              <p className="text-xs text-green-400">Online</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatsList;
