import express from "express";
import {sendMessage , getMessagesByUserId , getAllContacts , getChatPartners} from "../controllers/message.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const messageRouter = express.Router();

/**
 * @name sendMessage
 * @description Send a text message, image message, or text with an image to another user.
 * @access Private
 */
messageRouter.post("/send/:receiverId", authUser, sendMessage);

/**
 * @route GET /api/messages/contacts
 * @description Get all contacts except the authenticated user.
 * @access Private
 */
messageRouter.get("/contacts", authUser, getAllContacts);

/**
 * @route GET /api/messages/chats
 * @description Get users who have exchanged messages with the authenticated user.
 * @access Private
 */
messageRouter.get("/chats", authUser, getChatPartners);

/**
 * @route GET /api/messages/:userId
 * @description Get all messages exchanged with a user.
 * @access Private
 */
messageRouter.get("/messages/:userId", authUser, getMessagesByUserId);

export default messageRouter;