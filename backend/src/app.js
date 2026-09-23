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

app.use(express.json());
app.use(cookieParser());
app.use(rateLimitMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Error handling middleware must be last.
app.use(errorHandler);

export default app;