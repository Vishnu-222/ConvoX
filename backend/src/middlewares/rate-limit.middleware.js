import rateLimit from "express-rate-limit";

/**
 * @name rateLimitMiddleware
 * @description Limit the number of requests from a single IP address.
 */
const rateLimitMiddleware = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many requests. Please try again later.",
    },
});

export default rateLimitMiddleware;