import { useEffect } from "react";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import ChatContainer from "../components/ChatContainer";
import useChatStore from "../store/useChatStore";
import { socket } from "../services/socket";

const ChatPage = () => {
  const { selectedUser, activeTab, setActiveTab } = useChatStore();
  const getMyChatPartners = useChatStore((state) => state.getMyChatPartners);

  // Refresh the chat list when a new message arrives.
  useEffect(() => {
    const handleNewMessage = () => {
      getMyChatPartners(true);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [getMyChatPartners]);

  // Listen for conversations deleted by either participant.
  useEffect(() => {
    const handleConversationDeleted = ({ partnerId }) => {
      useChatStore.getState().handleConversationDeleted(partnerId);
    };

    socket.on("conversationDeleted", handleConversationDeleted);

    return () => {
      socket.off("conversationDeleted", handleConversationDeleted);
    };
  }, []);

  return (
    <div className="relative mx-auto h-[calc(100dvh-2rem)] min-h-0 w-full max-w-6xl md:h-[700px]">
      <BorderAnimatedContainer>
        {/* SIDEBAR: hide on mobile when a conversation is selected */}
        <div
          className={`${
            selectedUser ? "hidden md:flex" : "flex"
          } min-h-0 w-full shrink-0 flex-col bg-slate-800/50 backdrop-blur-sm md:w-80`}
        >
          <ProfileHeader />

          <ActiveTabSwitch activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3 md:p-4">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* CHAT AREA: full-width on mobile when selected */}
        <div
          className={`${
            selectedUser ? "flex" : "hidden md:flex"
          } min-h-0 min-w-0 flex-1 flex-col bg-slate-900/50 backdrop-blur-sm`}
        >
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
};

export default ChatPage;
