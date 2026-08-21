import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import rateLimitMiddleware from "./middlewares/rate-limit.middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(rateLimitMiddleware);

app.use("/api/auth", authRoutes);

// Error handling middleware must be last.
app.use(errorHandler);

export default app;