import { create } from "zustand";
import api from "../services/auth.api";

const useChatStore = create((set, get) => ({
  // Currently selected conversation/user
  selectedUser: null,

  // Users with whom the logged-in user has existing conversations
  chats: [],

  // All registered users except the logged-in user
  allContacts: [],

  // Messages of the currently selected conversation
  messages: [],

  // Loading states
  isUsersLoading: false,
  isMessagesLoading: false,

  // Sound settings
  
    // Sound effects preference — follows Chatify
    isSoundEnabled:
        JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

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
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });

    try {
      const response = await api.get("/api/messages/chats");

      set({
        chats: response.data.data,
        isUsersLoading: false,
      });
    } catch (error) {
      console.error(
        "Failed to fetch chats:",
        error.response?.data?.message || error.message,
      );

      set({
        chats: [],
        isUsersLoading: false,
      });
    }
  },

  // MESSAGE ACTIONS

  /**
   * @name getMessagesByUserId
   * @description
   * Fetch the complete conversation history with the selected user.
   */
  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const response = await api.get(`/api/messages/messages/${userId}`);

      set({
        messages: response.data.data,
        isMessagesLoading: false,
      });
    } catch (error) {
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
  setSelectedUser: async (user) => {
    set({
      selectedUser: user,
      messages: [],
    });

    // Load conversation history for selected user
    await useChatStore.getState().getMessagesByUserId(user._id);
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
}));

export default useChatStore;
