import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import rateLimitMiddleware from "./middlewares/rate-limit.middleware.js";
import messageRoutes from "./routes/message.routes.js";

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json({ limit: "8mb" }));
app.use(cookieParser());
app.use(rateLimitMiddleware);

// Health check for deployment monitoring.
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "ConvoX API is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Return JSON for unknown API endpoints.
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});

// Error handling middleware must be last.
app.use(errorHandler);

export default app;