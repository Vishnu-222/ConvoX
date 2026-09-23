import { Navigate } from "react-router";
import useAuthStore from "../store/useAuthStore";

function ProtectedRoute({ children }) {
    const { user, isCheckingAuth } = useAuthStore();

    // Wait until authentication check is complete
    if (isCheckingAuth) {
        return null;
    }

    // Not logged in → Login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Logged in → Allow access
    return children;
}

export default ProtectedRoute;