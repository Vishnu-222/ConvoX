
import { XIcon, ArrowLeftIcon } from "lucide-react";
import { useEffect } from "react";
import useChatStore from "../store/useChatStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser, onlineUsers } = useChatStore();

  // CLOSE CHAT WITH ESCAPE KEY
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setSelectedUser(null);
      }
    };

    window.addEventListener("keydown", handleEscKey);

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [setSelectedUser]);

  const isOnline =
    selectedUser && onlineUsers.includes(selectedUser._id);

  return (
    <div className="flex h-[72px] min-h-[72px] shrink-0 min-w-0 items-center justify-between border-b border-slate-700/50 bg-slate-800/50 px-3 sm:px-4 md:px-6">
      {/* USER INFO */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        {/* MOBILE BACK BUTTON */}
        <button
          type="button"
          onClick={() => setSelectedUser(null)}
          aria-label="Back to chats"
          className="shrink-0 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-700/60 hover:text-slate-200 md:hidden"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>

        <div className="relative shrink-0">
          <div className="size-10 overflow-hidden rounded-full sm:size-12">
            <img
              src={selectedUser?.profilePic || "/avatar.png"}
              alt={selectedUser?.fullName || "User avatar"}
              className="size-full object-cover"
            />
          </div>

          {/* Show the green indicator only when the selected user is online. */}
          {isOnline && (
            <span
              className="absolute right-0.5 top-0 size-3 rounded-full border-2 border-slate-800 bg-green-500"
              title="Online"
            />
          )}
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-medium text-slate-200">
            {selectedUser?.fullName}
          </h3>

          <p
            className={`text-xs ${
              isOnline ? "text-green-400" : "text-slate-400"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* CLOSE CHAT: retain the desktop control */}
      <button
        type="button"
        onClick={() => setSelectedUser(null)}
        aria-label="Close chat"
        className="ml-2 shrink-0 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-700/60 hover:text-slate-200"
      >
        <XIcon className="h-5 w-5 md:cursor-pointer" />
      </button>
    </div>
  );
}

export default ChatHeader;
