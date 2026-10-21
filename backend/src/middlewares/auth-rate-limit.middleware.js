import rateLimit from "express-rate-limit";

/**
 * @name authRateLimitMiddleware
 * @description Limit repeated authentication requests from a single IP address.
 */
const authRateLimitMiddleware = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many authentication attempts. Please try again later.",
    },
});

export default authRateLimitMiddleware;