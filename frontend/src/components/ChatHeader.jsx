import { XIcon } from "lucide-react";
import { useEffect } from "react";
import useChatStore from "../store/useChatStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();

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

  return (
    <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 flex-1">
      {/* USER INFO */}
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div className="size-12 overflow-hidden rounded-full">
            <img
              src={selectedUser?.profilePic || "/avatar.png"}
              alt={selectedUser?.fullName}
              className="size-full object-cover"
            />
          </div>

          <span
            className="absolute right-0.5 top-0 size-3 rounded-full border-2 border-slate-800 bg-green-500"
            title="Online status placeholder"
          />
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-medium text-slate-200">
            {selectedUser?.fullName}
          </h3>
          <p className="text-xs text-green-400">Online</p>
        </div>
      </div>

      {/* CLOSE CHAT */}
      <button type="button" onClick={() => setSelectedUser(null)}>
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
  );
}

export default ChatHeader;
