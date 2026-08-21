import express from "express";
import sendMessage from "../controllers/message.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send/:receiverId", authUser, sendMessage);

export default router;