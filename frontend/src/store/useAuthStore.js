import { create } from "zustand";
import api from "../services/auth.api";

const useAuthStore = create((set) => ({
  user: null,
  isCheckingAuth: true,

  // checking authentication status of the user
  checkAuth: async () => {
    try {
      const response = await api.get("/api/auth/check");

      set({
        user: response.data.user,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({
        user: null,
        isCheckingAuth: false,
      });

      console.error(
        "Authentication check failed:",
        error.response?.data || error.message,
      );
    }
  },

  // Signup user
  signup: async (formData) => {
    try {
      const response = await api.post("/api/auth/signup", formData);

      // Return the response without automatically logging the user in.
      return response.data;
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);

      throw error;
    }
  },

  // Login user
  login: async (formData) => {
    try {
      const response = await api.post("/api/auth/login", formData);

      set({
        user: response.data.user,
      });

      return response.data;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post("/api/auth/logout");

      set({
        user: null,
      });
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);

      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/api/auth/update-profile", profileData);

      set({
        user: response.data.user,
      });

      return response.data;
    } catch (error) {
      console.error(
        "Profile update failed:",
        error.response?.data || error.message,
      );

      throw error;
    }
  },

  // Update only the logged-in user's full name.
  updateFullName: async (fullName) => {
    try {
      const response = await api.patch("/api/auth/update-name", {
        fullName,
      });

      const updatedFullName = response.data.user.fullName;

      // Preserve the user's ID, email, profile picture, and all other fields.
      set((state) => ({
        user: state.user
          ? {
              ...state.user,
              fullName: updatedFullName,
            }
          : state.user,
      }));

      return response.data;
    } catch (error) {
      console.error(
        "Full name update failed:",
        error.response?.data || error.message,
      );

      throw error;
    }
  },
}));

export default useAuthStore;
