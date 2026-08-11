import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import {generateToken} from "../utils/auth.utils.js";

/**
 * @name signup
 * @description Register a new user with full name, email, and password.
 * @access Public
 */
export const signup = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;

        // Normalize user-provided values before storing them.
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedFullName = fullName.trim().replace(/\s+/g, " ");

        // Check whether an account already exists with the provided email.
        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists.",
            });
        }

        // Hash the user's password before storing it in the database.
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            fullName: normalizedFullName,
            email: normalizedEmail,
            password: hashedPassword,
        });

        // Generate JWT and store it in an HTTP-only cookie.
        generateToken(user._id, res);

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @name login
 * @description Login an existing user using email and password.
 * @access Public
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Normalize the email before querying the database.
        const normalizedEmail = email.trim().toLowerCase();

        // Find the user associated with the provided email.
        const user = await User.findOne({
            email: normalizedEmail,
        });

        // Use a generic error message to avoid revealing whether an account exists.
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // Compare the provided password with the stored hashed password.
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // Generate JWT and store it in an HTTP-only cookie.
        generateToken(user._id, res);

        return res.status(200).json({
            success: true,
            message: "User logged in successfully.",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @name logout
 * @description Logout the current user by clearing the JWT authentication cookie.
 * @access Public
 */
export const logout = async (req, res, next) => {
    try {
        // Clear the JWT cookie from the client.
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        return res.status(200).json({
            success: true,
            message: "User logged out successfully.",
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @name checkAuth
 * @description Check whether the current user is authenticated and return their details.
 * @access Private
 */
export const checkAuth = async (req, res, next) => {
    try {
        // Find the authenticated user from the database.
        const user = await User.findById(req.user.userId).select("-password");

        return res.status(200).json({
            success: true,
            message: "User is authenticated.",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            },
        });
    } catch (error) {
        next(error);
    }
};