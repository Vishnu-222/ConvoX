import { create } from "zustand";
import api from "../services/auth.api";
import { socket } from "../services/socket";
const notificationSound = new Audio("/sounds/notification.mp3");

// Keep track of this store's own Socket.io listener.
let newMessageHandler = null;
let messagesRequestId = 0;

const useChatStore = create((set, get) => ({
  // Currently selected conversation/user
  selectedUser: null,

  // Preserve message drafts separately for each conversation.
  messageDrafts: {},

  /**
   * @name updateMessageDraft
   * @description Save a text or image draft for a specific conversation.
   */
  updateMessageDraft: (conversationId, updates) => {
    if (!conversationId) return;

    set((state) => ({
      messageDrafts: {
        ...state.messageDrafts,
        [conversationId]: {
          text: "",
          image: null,
          ...(state.messageDrafts[conversationId] || {}),
          ...updates,
        },
      },
    }));
  },

  // Users with whom the logged-in user has existing conversations
  chats: [],

  // All registered users except the logged-in user
  allContacts: [],

  // IDs of users currently online according to the server.
  onlineUsers: [],

  // Update the list of online users received from Socket.io.
  setOnlineUsers: (userIds) => {
    set({ onlineUsers: userIds });
  },

  // Messages of the currently selected conversation
  messages: [],

  // Loading states
  isUsersLoading: false,
  isMessagesLoading: false,

  // Sound settings

  // Sound effects preference — follows Chatify
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  // Toggle sound effects and persist the preference
  toggleSound: () => {
    const isSoundEnabled = !get().isSoundEnabled;

    localStorage.setItem("isSoundEnabled", isSoundEnabled);
    set({ isSoundEnabled });
  },

  // CHAT / CONTACT ACTIONS
  activeTab: "chats",

  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },

  /**
   * @name getAllContacts
   * @description
   * Fetch all users that can be contacted by the logged-in user.
   */
  getAllContacts: async () => {
    set({ isUsersLoading: true });

    try {
      const response = await api.get("/api/messages/contacts");

      set({
        allContacts: response.data.data,
        isUsersLoading: false,
      });
    } catch (error) {
      console.error(
        "Failed to fetch contacts:",
        error.response?.data?.message || error.message,
      );

      set({
        allContacts: [],
        isUsersLoading: false,
      });
    }
  },

  /**
   * @name getMyChatPartners
   * @description
   * Fetch users with whom the logged-in user has already exchanged messages.
   */
  getMyChatPartners: async (silent = false) => {
    if (!silent) set({ isUsersLoading: true });

    try {
      const response = await api.get("/api/messages/chats");

      set({
        chats: response.data.data,
        ...(silent ? {} : { isUsersLoading: false }),
      });
    } catch (error) {
      console.error(
        "Failed to fetch chats:",
        error.response?.data?.message || error.message,
      );

      if (!silent) {
        set({ chats: [], isUsersLoading: false });
      }
    }
  },

  // MESSAGE ACTIONS

  /**
   * @name subscribeToMessages
   * @description Listen for incoming messages from the selected conversation partner.
   */
  subscribeToMessages: () => {
    const { selectedUser } = get();

    if (!selectedUser) return;

    // Remove only the previous listener registered by this store.
    if (newMessageHandler) {
      socket.off("newMessage", newMessageHandler);
    }

    newMessageHandler = (newMessage) => {
      const currentSelectedUser = get().selectedUser;

      if (!currentSelectedUser) return;

      const selectedUserId = currentSelectedUser._id.toString();
      const senderId = newMessage.sender.toString();
      const receiverId = newMessage.receiver.toString();

      // Accept messages belonging to the currently selected conversation.
      const belongsToConversation =
        senderId === selectedUserId || receiverId === selectedUserId;

      if (!belongsToConversation) return;

      // Prevent duplicate messages.
      const alreadyExists = get().messages.some(
        (message) => message._id === newMessage._id,
      );

      if (alreadyExists) return;
      // Debug the sound settings and incoming message.
      console.log("Incoming message received");
      console.log("Sound enabled:", get().isSoundEnabled);

      // Play a sound only when notifications are enabled.
      if (get().isSoundEnabled) {
        notificationSound.currentTime = 0;

        notificationSound.play().catch((error) => {
          console.error("Notification sound playback failed:", error);
        });
      }

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    };

    socket.on("newMessage", newMessageHandler);
  },

  /**
   * @name unsubscribeFromMessages
   * @description Remove this store's incoming-message listener.
   */
  unsubscribeFromMessages: () => {
    if (newMessageHandler) {
      socket.off("newMessage", newMessageHandler);
      newMessageHandler = null;
    }
  },

  /**
   * @name getMessagesByUserId
   * @description
   * Fetch conversation history while preventing stale requests
   * from overwriting the currently selected conversation.
   */
  getMessagesByUserId: async (userId) => {
    const requestId = ++messagesRequestId;

    set({ isMessagesLoading: true });

    try {
      const response = await api.get(`/api/messages/messages/${userId}`);

      // Ignore responses from older conversation requests.
      if (requestId !== messagesRequestId) return;

      // Ensure the requested user is still selected.
      const currentSelectedUserId = get().selectedUser?._id?.toString();

      if (currentSelectedUserId !== userId.toString()) return;

      set({
        messages: response.data.data,
        isMessagesLoading: false,
      });
    } catch (error) {
      // Ignore errors from requests that are no longer current.
      if (requestId !== messagesRequestId) return;

      const currentSelectedUserId = get().selectedUser?._id?.toString();

      if (currentSelectedUserId !== userId.toString()) return;

      console.error(
        "Failed to fetch messages:",
        error.response?.data?.message || error.message,
      );

      set({
        messages: [],
        isMessagesLoading: false,
      });
    }
  },

  // SELECTED USER ACTIONS

  /**
   * @name setSelectedUser
   * @description
   * Select a user and load their conversation.
   */
  setSelectedUser: (user) => {
    set({
      selectedUser: user,
      messages: [],
    });
  },

  /**
   * @name clearSelectedUser
   * @description
   * Clear the currently selected conversation.
   */
  clearSelectedUser: () => {
    set({
      selectedUser: null,
      messages: [],
    });
  },

  /**
   * @name handleConversationDeleted
   * @description
   * Handle a conversation deleted by either participant.
   */
  handleConversationDeleted: (partnerId) => {
    if (!partnerId) return;

    const deletedPartnerId = partnerId.toString();

    set((state) => {
      const isSelected =
        state.selectedUser?._id?.toString() === deletedPartnerId;

      // Remove only this conversation's saved draft.
      const nextDrafts = { ...state.messageDrafts };
      delete nextDrafts[deletedPartnerId];

      return {
        // Remove the partner from the chat list.
        chats: state.chats.filter(
          (chat) => chat._id?.toString() !== deletedPartnerId,
        ),

        // Close the conversation only if it is currently open.
        selectedUser: isSelected ? null : state.selectedUser,
        messages: isSelected ? [] : state.messages,
        isMessagesLoading: isSelected ? false : state.isMessagesLoading,

        // Preserve drafts belonging to every other conversation.
        messageDrafts: nextDrafts,
      };
    });
  },

  /**
   * @name deleteConversation
   * @description
   * Delete a conversation for both participants.
   */
  deleteConversation: async (partnerId) => {
    try {
      await api.delete(`/api/messages/conversation/${partnerId}`);

      // Update the current user's UI after the backend confirms deletion.
      get().handleConversationDeleted(partnerId);

      // Refresh the chat list from the database.
      await get().getMyChatPartners(true);

      return true;
    } catch (error) {
      console.error(
        "Delete conversation error:",
        error.response?.data?.message || error.message,
      );

      throw error;
    }
  },
}));

export default useChatStore;
