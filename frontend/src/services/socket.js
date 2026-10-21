import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? window.location.origin
    : "http://localhost:3000");

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Connected to ConvoX Socket.io:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Socket.io connection failed:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("Socket.io disconnected:", reason);
});
