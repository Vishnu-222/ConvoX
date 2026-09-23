import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";

import useAuthStore from "./store/useAuthStore";
import router from "./app.routes";

function App() {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <>
            <RouterProvider router={router} />
            <Toaster position="top-right" />
        </>
    );
}

export default App;