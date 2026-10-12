import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";
import useChatStore from "../store/useChatStore";

function ChatContainer() {
  const { selectedUser } = useChatStore();

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
