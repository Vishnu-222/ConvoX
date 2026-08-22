import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../config/cloudinary.js";

/**
 * @name sendMessage
 * @description Send a text message to another user.
 * @access Private
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { receiverId } = req.params;
    const { text, image } = req.body;

    const senderId = req.user.userId;

    if (senderId.toString() === receiverId) {
      return res.status(400).json({
        success: false,
        message: "Cannot send messages to yourself.",
      });
    }

    if (!text?.trim() && !image) {
      return res.status(400).json({
        success: false,
        message: "Text or image is required.",
      });
    }

    if (text && text.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Message cannot exceed 2000 characters.",
      });
    }

    const receiverExists = await User.exists({ _id: receiverId });

    if (!receiverExists) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found.",
      });
    }

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text: text?.trim(),
      image: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @name getMessagesByUserId
 * @description Get all messages exchanged between the authenticated user and another user.
 * @access Private
 */
export const getMessagesByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.userId;

        // Prevent requesting a conversation with yourself.
        if (currentUserId.toString() === userId) {
            return res.status(400).json({
                success: false,
                message: "Cannot fetch messages with yourself.",
            });
        }

        // Ensure the requested user exists.
        const userExists = await User.exists({ _id: userId });

        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Find messages exchanged in both directions.
        const messages = await Message.find({
            $or: [
                {
                    sender: currentUserId,
                    receiver: userId,
                },
                {
                    sender: userId,
                    receiver: currentUserId,
                },
            ],
        }).sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            message: "Messages fetched successfully.",
            data: messages,
        });
    } catch (error) {
        console.error("Get messages error:", error);
        next(error);
    }
};

/**
 * @name getAllContacts
 * @description Get all users except the authenticated user.
 * @access Private
 */
export const getAllContacts = async (req, res, next) => {
    try {
        const currentUserId = req.user.userId;

        const contacts = await User.find({
            _id: {
                $ne: currentUserId,
            },
        }).select("-password");

        return res.status(200).json({
            success: true,
            message: "Contacts fetched successfully.",
            data: contacts,
        });
    } catch (error) {
        console.error("Get contacts error:", error);
        next(error);
    }
};

/**
 * @name getChatPartners
 * @description Get all users who have exchanged messages with the authenticated user.
 * @access Private
 */
export const getChatPartners = async (req, res, next) => {
    try {
        const currentUserId = req.user.userId;

        // Find all messages involving the authenticated user.
        const messages = await Message.find({
            $or: [
                { sender: currentUserId },
                { receiver: currentUserId },
            ],
        }).select("sender receiver");

        // Collect unique user IDs from the conversations.
        const partnerIds = new Set();

        messages.forEach((message) => {
            const partnerId =
                message.sender.toString() === currentUserId.toString()
                    ? message.receiver.toString()
                    : message.sender.toString();

            partnerIds.add(partnerId);
        });

        // Fetch the users who are actual chat partners.
        const chatPartners = await User.find({
            _id: {
                $in: [...partnerIds],
            },
        }).select("-password");

        return res.status(200).json({
            success: true,
            message: "Chat partners fetched successfully.",
            data: chatPartners,
        });
    } catch (error) {
        console.error("Get chat partners error:", error);
        next(error);
    }
};