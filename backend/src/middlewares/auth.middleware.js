import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * @name authUser
 * @description Authenticate the user using the JWT stored in the HTTP-only cookie.
 * @access Private
 */
export const authUser = async (req, res, next) => {
    try {
        // Retrieve the JWT from the authentication cookie.
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        // Verify the JWT using the application's secret key.
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Attach the decoded user ID to the request.
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token.",
        });
    }
};