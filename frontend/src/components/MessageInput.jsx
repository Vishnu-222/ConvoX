import { useEffect, useRef, useState } from "react";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import api from "../services/auth.api";
import useKeyboardSound from "../hooks/useKeyboardSound";

const EMPTY_DRAFT = { text: "", image: null };

function MessageInput() {
  // Keep a separate draft for every conversation.
  const [drafts, setDrafts] = useState({});
  const [isSending, setIsSending] = useState(false);

  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  const selectedUser = useChatStore((state) => state.selectedUser);
  const isSoundEnabled = useChatStore((state) => state.isSoundEnabled);
  const { user } = useAuthStore();
  const { playRandomKeyStrokeSound } = useKeyboardSound();

  const receiverId = selectedUser?._id || selectedUser?.id;
  const conversationId = receiverId?.toString();

  // Get only the draft belonging to the selected conversation.
  const activeDraft = conversationId
    ? drafts[conversationId] || EMPTY_DRAFT
    : EMPTY_DRAFT;

  const { text, image } = activeDraft;

  // Automatically focus the input when switching chats
  // and after a message finishes sending.
  useEffect(() => {
    if (!isSending) {
      inputRef.current?.focus();
    }
  }, [conversationId, isSending]);

  // Update the current conversation's draft only.
  const updateDraft = (updates) => {
    if (!conversationId) return;

    setDrafts((previousDrafts) => ({
      ...previousDrafts,
      [conversationId]: {
        ...(previousDrafts[conversationId] || EMPTY_DRAFT),
        ...updates,
      },
    }));
  };

  // IMAGE SELECTION
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file || !conversationId) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    // Capture the conversation before reading the file.
    const targetConversationId = conversationId;
    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result !== "string") return;

      setDrafts((previousDrafts) => ({
        ...previousDrafts,
        [targetConversationId]: {
          ...(previousDrafts[targetConversationId] || EMPTY_DRAFT),
          image: reader.result,
        },
      }));
    };

    reader.onerror = () => {
      toast.error("Failed to read the image.");
    };

    reader.readAsDataURL(file);
  };

  // REMOVE SELECTED IMAGE
  const handleRemoveImage = () => {
    updateDraft({ image: null });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // SEND MESSAGE
  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Capture the intended recipient and draft before the request.
    const targetConversationId = conversationId;
    const targetReceiverId = receiverId;
    const messageText = text.trim();
    const messageImage = image;

    if (
      !targetConversationId ||
      !targetReceiverId ||
      (!messageText && !messageImage) ||
      isSending
    ) {
      return;
    }

    const optimisticMessage = {
      _id: `optimistic-${Date.now()}`,
      sender: user?._id || user?.id,
      receiver: targetReceiverId,
      text: messageText,
      image: messageImage,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    // Add the temporary message only to its own conversation.
    useChatStore.setState((state) => {
      const currentConversationId =
        (state.selectedUser?._id || state.selectedUser?.id)?.toString();

      if (currentConversationId !== targetConversationId) {
        return state;
      }

      return {
        messages: [...state.messages, optimisticMessage],
      };
    });

    // Clear the submitted conversation's draft.
    setDrafts((previousDrafts) => ({
      ...previousDrafts,
      [targetConversationId]: { ...EMPTY_DRAFT },
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setIsSending(true);

    try {
      const response = await api.post(
        `/api/messages/send/${targetReceiverId}`,
        {
          text: messageText,
          image: messageImage,
        },
      );

      const savedMessage = response.data.data;

      // Update the message only if its conversation is still open.
      useChatStore.setState((state) => {
        const currentConversationId =
          (state.selectedUser?._id || state.selectedUser?.id)?.toString();

        if (currentConversationId !== targetConversationId) {
          return state;
        }

        const optimisticExists = state.messages.some(
          (message) => message._id === optimisticMessage._id,
        );

        const savedAlreadyExists = state.messages.some(
          (message) =>
            message._id?.toString() === savedMessage._id?.toString(),
        );

        if (optimisticExists) {
          return {
            messages: state.messages.map((message) =>
              message._id === optimisticMessage._id
                ? savedMessage
                : message,
            ),
          };
        }

        if (!savedAlreadyExists) {
          return {
            messages: [...state.messages, savedMessage],
          };
        }

        return state;
      });
    } catch (error) {
      // Remove the failed temporary message only from its conversation.
      useChatStore.setState((state) => {
        const currentConversationId =
          (state.selectedUser?._id || state.selectedUser?.id)?.toString();

        if (currentConversationId !== targetConversationId) {
          return state;
        }

        return {
          messages: state.messages.filter(
            (message) => message._id !== optimisticMessage._id,
          ),
        };
      });

      console.error(
        "Failed to send message:",
        error.response?.data?.message || error.message,
      );

      toast.error(
        error.response?.data?.message || "Failed to send message",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 border-t border-slate-700/50">
      {/* IMAGE PREVIEW */}
      {image && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={image}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-slate-700"
            />

            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={isSending}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MESSAGE FORM */}
      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl mx-auto flex space-x-4"
      >
        {/* MESSAGE INPUT */}
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => {
            updateDraft({ text: e.target.value });

            if (isSoundEnabled) {
              playRandomKeyStrokeSound();
            }
          }}
          disabled={isSending}
          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4 text-slate-200 outline-none focus:border-cyan-500/50"
          placeholder="Type your message..."
        />

        {/* HIDDEN FILE INPUT */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        {/* IMAGE BUTTON */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSending}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${
            image ? "text-cyan-500" : ""
          }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        {/* SEND BUTTON */}
        <button
          type="submit"
          disabled={isSending || (!text.trim() && !image)}
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;