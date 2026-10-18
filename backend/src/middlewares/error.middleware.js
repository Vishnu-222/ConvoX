
/**
 * @description Global error handling middleware.
 * @access Public
 */
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message);

    // If the response has already started, let Express handle the error.
    if (res.headersSent) {
        return next(err);
    }

    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || "Internal Server Error.";

    // Handle malformed JSON request bodies.
    if (err.type === "entity.parse.failed") {
        statusCode = 400;
        message = "Invalid JSON in request body.";
    }

    // Handle oversized request bodies.
    if (err.type === "entity.too.large") {
        statusCode = 413;
        message = "Request body is too large.";
    }

    // Never expose internal server details in production.
    if (statusCode >= 500 && process.env.NODE_ENV === "production") {
        message = "Internal Server Error.";
    }

    return res.status(statusCode).json({
        success: false,
        message,
    });
};

export default errorHandler;
