import { createBrowserRouter, Navigate } from "react-router";
import Login from "./pages/Login";
import SignUpPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/chat",
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: <Navigate to="/chat" replace />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
