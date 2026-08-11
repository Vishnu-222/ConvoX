import jwt from "jsonwebtoken";

/**
 * @name generateToken
 * @description Generate a JWT for the authenticated user and store it in an HTTP-only cookie.
 * @returns {string} Generated JWT token.
 */
export const generateToken = (userId, res) => {
    // Generate JWT containing the user's ID.
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );

    // Store the JWT in an HTTP-only cookie to prevent client-side JavaScript access.
    res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    });

    return token;
};