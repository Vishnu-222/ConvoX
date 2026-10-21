import jwt from "jsonwebtoken";

/**
 * @name socketAuthMiddleware
 * @description Authenticate a Socket.io connection using the JWT cookie.
 * @access Private
 */
const socketAuthMiddleware = (socket, next) => {
    try {
        // Read the authentication cookie from the Socket.io handshake.
        const cookies = socket.handshake.headers.cookie || "";

        const tokenCookie = cookies
            .split("; ")
            .find((cookie) => cookie.startsWith("token="));

        const token = tokenCookie?.split("=")[1];

        if (!token) {
            return next(new Error("Authentication required."));
        }

        // Verify the JWT using the same secret as REST authentication.
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Attach the authenticated user's ID to this socket.
        socket.userId = decoded.userId.toString();

        next();
    } catch (error) {
        next(new Error("Invalid or expired authentication token."));
    }
};

export default socketAuthMiddleware;
