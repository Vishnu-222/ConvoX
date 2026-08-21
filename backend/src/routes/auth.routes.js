import express from "express";
import { signup , login , logout , checkAuth , updateProfile} from "../controllers/auth.controller.js";
import { validateSignup , validateLogin } from "../validators/auth.validator.js";
import { authUser } from "../middlewares/auth.middleware.js";
import authRateLimitMiddleware from "../middlewares/auth-rate-limit.middleware.js";

const authRouter = express.Router();

/**
 * @route POST /api/auth/signup
 * @description Register a new user
 * @access Public
 */
authRouter.post("/signup", validateSignup, authRateLimitMiddleware , signup);

/**
 * @route POST /api/auth/login
 * @description Login user with email and password.
 * @access Public
 */
authRouter.post("/login", validateLogin, authRateLimitMiddleware, login);

/**
 * @route POST /api/auth/logout
 * @description Logout the current user.
 * @access Public
 */
authRouter.post("/logout", logout);

/**
 * @route GET /api/auth/check
 * @description Check whether the current user is authenticated.
 * @access Private
 */
authRouter.get("/check", authUser, checkAuth);

/**
 * @route PUT /api/auth/update-profile
 * @description Update the authenticated user's profile picture.
 * @access Private
 */
authRouter.put("/update-profile", authUser, updateProfile );

export default authRouter;