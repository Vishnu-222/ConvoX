import { useRef, useState } from "react";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import api from "../services/auth.api";
import useKeyboardSound from "../hooks/useKeyboardSound";

function MessageInput() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const fileInputRef = useRef(null);

  const { selectedUser, messages, isSoundEnabled } = useChatStore();
  const { user } = useAuthStore();
  const { playRandomKeyStrokeSound } = useKeyboardSound();

  // IMAGE SELECTION
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Only allow image files
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    // Limit image size to 5 MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB.");
      return;
    }

    // Convert image to Base64
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.onerror = () => {
      toast.error("Failed to read the image.");
    };

    reader.readAsDataURL(file);
  };

 
  // REMOVE SELECTED IMAGE
  const handleRemoveImage = () => {
    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // SEND MESSAGE
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!selectedUser || (!text.trim() && !image)) return;

    const messageText = text.trim();
    const messageImage = image;
    const receiverId = selectedUser._id;

    // Create a temporary message for immediate UI display
    const optimisticMessage = {
      _id: `optimistic-${Date.now()}`,
      senderId: user?._id,
      receiverId,
      text: messageText,
      image: messageImage,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    // Add the temporary message immediately
    useChatStore.setState((state) => ({
      messages: [...state.messages, optimisticMessage],
    }));

    // Clear the input immediately
    setText("");
    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setIsSending(true);

    try {
      const response = await api.post(`/api/messages/send/${receiverId}`, {
        text: messageText,
        image: messageImage,
      });

      const savedMessage = response.data.data;

      // Replace the temporary message with the server-saved message
      useChatStore.setState((state) => ({
        messages: state.messages.map((message) =>
          message._id === optimisticMessage._id ? savedMessage : message,
        ),
      }));
    } catch (error) {
      // Remove the temporary message if sending fails
      useChatStore.setState((state) => ({
        messages: state.messages.filter(
          (message) => message._id !== optimisticMessage._id,
        ),
      }));

      console.error(
        "Failed to send message:",
        error.response?.data?.message || error.message,
      );

      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  // UI
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
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);

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
