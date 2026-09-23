import { create } from "zustand";
import api from "../services/auth.api";

const useAuthStore = create((set) => ({
  user: null,
  isCheckingAuth: true,

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

  signup: async (formData) => {
    try {
      const response = await api.post("/api/auth/signup", formData);

      set({
        user: response.data.user,
      });

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
}));

export default useAuthStore;
