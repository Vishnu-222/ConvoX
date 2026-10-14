import { io } from "socket.io-client";

// Create the Socket.io client 
export const socket = io("http://localhost:3000", {
  autoConnect: false,
  withCredentials: true,
});

// Log successful Socket.io connections.
socket.on("connect", () => {
    console.log("Connected to ConvoX Socket.io:", socket.id);
});

// Log connection errors, including authentication failures.
socket.on("connect_error", (error) => {
    console.error("Socket.io connection failed:", error.message);
});

// Log socket disconnections.
socket.on("disconnect", (reason) => {
    console.log("Socket.io disconnected:", reason);
});