import { useEffect, useRef } from "react";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function formatMessageTime(date) {
  if (!date) return "";

  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function MessagesList() {
  const { messages, isMessagesLoading } = useChatStore();
  const { user } = useAuthStore();

  const messagesEndRef = useRef(null);

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // LOADING STATE
  if (isMessagesLoading) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <MessagesLoadingSkeleton />
      </div>
    );
  }

  // EMPTY CONVERSATION STATE
  if (messages.length === 0) {
    return <NoChatHistoryPlaceholder />;
  }

  // MESSAGE LIST
  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages.map((message) => {
        const currentUserId = user?._id || user?.id;

        const isMyMessage = message.sender?.toString() === currentUserId?.toString();

        return (
          <div
            key={message._id}
            className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
          >
            <div className="max-w-[70%]">
              <div
                className={`rounded-2xl px-4 py-2 ${
                  isMyMessage
                    ? "rounded-br-sm bg-cyan-500 text-white"
                    : "rounded-bl-sm bg-slate-700 text-slate-200"
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Message attachment"
                    className="mb-2 max-w-full rounded-lg"
                  />
                )}

                {message.text && <p className="break-words">{message.text}</p>}

                <p
                  className={`mt-1 text-right text-[11px] ${
                    isMyMessage ? "text-cyan-100" : "text-slate-400"
                  }`}
                >
                  {formatMessageTime(message.createdAt)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessagesList;
