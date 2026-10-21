import { useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";
import useChatStore from "../store/useChatStore";

function ChatContainer() {
  const selectedUser = useChatStore((state) => state.selectedUser);
  const getMessagesByUserId = useChatStore(
    (state) => state.getMessagesByUserId
  );
  const subscribeToMessages = useChatStore(
    (state) => state.subscribeToMessages
  );
  const unsubscribeFromMessages = useChatStore(
    (state) => state.unsubscribeFromMessages
  );

  // Load conversation history and subscribe to new messages.
  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [
    selectedUser?._id,
    getMessagesByUserId,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* CHAT HEADER */}
      <ChatHeader selectedUser={selectedUser} />

      {/* MESSAGES */}
      <MessagesList />

      {/* MESSAGE INPUT */}
      <MessageInput />
    </div>
  );
}

export default ChatContainer;