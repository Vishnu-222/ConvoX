import { Server } from "socket.io";
import socketAuthMiddleware from "../middlewares/socket-auth.middleware.js";

let io;

// Track connected sockets for each authenticated user.
// Map structure: userId -> Set of socket IDs
const onlineUsers = new Map();

export const getIO = () => io;

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  // Authenticate each incoming Socket.io connection.
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    const userId = socket.userId;

    // Create a socket collection for this user if needed.
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    // Register this socket for the authenticated user.
    onlineUsers.get(userId).add(socket.id);
    // Broadcast the current online-user list to all connected clients.
    io.emit("onlineUsers", [...onlineUsers.keys()]);

    console.log("Socket.io client connected:", socket.id);
    console.log("Authenticated user:", userId);

    socket.on("disconnect", () => {
      const userSockets = onlineUsers.get(userId);

      if (userSockets) {
        // Remove only the socket that disconnected.
        userSockets.delete(socket.id);

        // Mark the user offline only when no sockets remain.
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
        }
      }
      // Broadcast updated presence after this socket disconnects.
      io.emit("onlineUsers", [...onlineUsers.keys()]);

      console.log("Socket.io client disconnected:", socket.id);
    });
  });

  return io;
};

// Return the IDs of currently online users.
export const getOnlineUsers = () => [...onlineUsers.keys()];

/**
 * @name getUserSocketIds
 * @description Get all active socket IDs belonging to a user.
 * @param {string} userId - MongoDB ID of the user.
 * @returns {string[]} Active socket IDs.
 */
export const getUserSocketIds = (userId) => {
  return [...(onlineUsers.get(userId.toString()) || [])];
};