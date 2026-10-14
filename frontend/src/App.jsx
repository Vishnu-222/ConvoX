import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";

import useAuthStore from "./store/useAuthStore";
import useChatStore from "./store/useChatStore";
import router from "./app.routes";
import { socket } from "./services/socket";

function App() {
  const { checkAuth, user, isCheckingAuth } = useAuthStore();
  const setOnlineUsers = useChatStore((state) => state.setOnlineUsers);

  // Support either MongoDB's _id or an id field.
  const userId = user?._id || user?.id;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Listen for online-user updates from the backend.
  useEffect(() => {
    socket.on("onlineUsers", setOnlineUsers);

    return () => {
      socket.off("onlineUsers", setOnlineUsers);
    };
  }, [setOnlineUsers]);

  // Manage the Socket.io connection based on authentication state.
  useEffect(() => {
    // Wait until the initial authentication check finishes.
    if (isCheckingAuth) return;

    // Connect only when an authenticated user exists.
    if (userId) {
      socket.connect();
    } else {
      socket.disconnect();
    }

    // Disconnect when the app unmounts or the user changes.
    return () => {
      socket.disconnect();
    };
  }, [userId, isCheckingAuth]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-900 p-4">
      {/* FIXED APP BACKGROUND: GRID */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `
                        linear-gradient(to right, #4f4f4f2e 1px, transparent 1px),
                        linear-gradient(to bottom, #4f4f4f2e 1px, transparent 1px)
                    `,
          backgroundSize: "14px 24px",
        }}
      />

      {/* BACKGROUND GLOW: TOP LEFT */}
      <div className="pointer-events-none fixed -left-4 top-0 size-96 bg-pink-500 opacity-20 blur-[100px]" />

      {/* BACKGROUND GLOW: BOTTOM RIGHT */}
      <div className="pointer-events-none fixed -bottom-4 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

      {/* APPLICATION ROUTES */}
      <div className="relative z-10 w-full">
        <RouterProvider router={router} />
      </div>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
