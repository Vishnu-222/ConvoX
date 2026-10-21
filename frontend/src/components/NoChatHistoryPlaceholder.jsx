import { useState } from "react";
import { MessageCircleIcon } from "lucide-react";
import toast from "react-hot-toast";
import useChatStore from "../store/useChatStore";
import api from "../services/auth.api";

const suggestions = ["Say Hello 👋", "How are you?", "Meet up soon?"];

function NoChatHistoryPlaceholder() {
  const selectedUser = useChatStore((state) => state.selectedUser);
  const [sendingSuggestion, setSendingSuggestion] = useState(false);

  const handleSuggestionClick = async (text) => {
    const receiverId = selectedUser?._id || selectedUser?.id;

    if (!receiverId || sendingSuggestion) return;

    const conversationId = String(receiverId);
    setSendingSuggestion(true);

    try {
      const response = await api.post(`/api/messages/send/${receiverId}`, {
        text,
        image: null,
      });

      const savedMessage = response.data.data;

      // Add the message only if this conversation is still selected.
      useChatStore.setState((state) => {
        const currentId = String(
          state.selectedUser?._id || state.selectedUser?.id || "",
        );

        const exists = state.messages.some(
          (message) => String(message._id) === String(savedMessage._id),
        );

        if (currentId !== conversationId || exists) {
          return state;
        }

        return {
          messages: [...state.messages, savedMessage],
        };
      });

      // Refresh the chat list without showing a loading skeleton.
      useChatStore.getState().getMyChatPartners(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message.");
    } finally {
      setSendingSuggestion(false);
    }
  };

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

        {/* QUICK-ACTION SUGGESTIONS */}
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((text) => (
            <button
              key={text}
              type="button"
              onClick={() => handleSuggestionClick(text)}
              disabled={sendingSuggestion}
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-cyan-600 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NoChatHistoryPlaceholder;
