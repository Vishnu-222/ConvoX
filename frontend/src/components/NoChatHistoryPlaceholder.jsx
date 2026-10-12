import { MessageCircleIcon } from "lucide-react";
import useChatStore from "../store/useChatStore";

function NoChatHistoryPlaceholder() {
  const { selectedUser } = useChatStore();

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        {/* ICON */}
        <div className="size-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageCircleIcon className="size-10 text-cyan-400" />
        </div>

        {/* HEADING */}
        <h3 className="text-xl font-semibold text-slate-200 mb-2">
          Start your conversation with {selectedUser?.fullName}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-slate-400 mb-6">
          This is the beginning of your conversation. Send a message below to
          get started.
        </p>

        {/* SUGGESTIONS */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
           className="rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-cyan-600 hover:to-cyan-700"
          >
            Say Hello 👋
          </button>

          <button
            type="button"
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-cyan-600 hover:to-cyan-700"
          >
            How are you?
          </button>

          <button
            type="button"
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-cyan-600 hover:to-cyan-700"
          >
            Meet up soon?
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoChatHistoryPlaceholder;
