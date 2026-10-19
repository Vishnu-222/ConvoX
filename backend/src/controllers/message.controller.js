import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../config/cloudinary.js";
import { getIO, getUserSocketIds } from "../config/socket.js";

/**
 * @name sendMessage
 * @description Send a text message to another user.
 * @access Private
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { receiverId } = req.params;
    const { text, image } = req.body || {};

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

    // Deliver the saved message to every active socket of the recipient.
    const io = getIO();
    const receiverSocketIds = getUserSocketIds(receiverId);

    receiverSocketIds.forEach((socketId) => {
      io.to(socketId).emit("newMessage", message);
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
 * @description Get all users except the authenticated user, sorted alphabetically.
 * @access Private
 */
export const getAllContacts = async (req, res, next) => {
  try {
    const currentUserId = req.user.userId;

    const contacts = await User.find({
      _id: {
        $ne: currentUserId,
      },
    })
      .select("-password")
      .collation({ locale: "en", strength: 2 })
      .sort({ fullName: 1 });

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
 * @description Get chat partners ordered by their most recent message.
 * @access Private
 */
export const getChatPartners = async (req, res, next) => {
  try {
    const currentUserId = req.user.userId;

    // Fetch the newest messages first.
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .select("sender receiver createdAt")
      .sort({ createdAt: -1, _id: -1 });

    // The first message encountered for each partner is their
    // most recent conversation activity.
    const partnerIds = [];
    const seenPartnerIds = new Set();

    for (const message of messages) {
      const partnerId =
        message.sender.toString() === currentUserId.toString()
          ? message.receiver.toString()
          : message.sender.toString();

      if (!seenPartnerIds.has(partnerId)) {
        seenPartnerIds.add(partnerId);
        partnerIds.push(partnerId);
      }
    }

    // Fetch the partner profiles.
    const chatPartners = await User.find({
      _id: { $in: partnerIds },
    }).select("-password");

    // MongoDB's $in query does not guarantee our requested order.
    // Restore the most-recent-first order explicitly.
    const partnersById = new Map(
      chatPartners.map((partner) => [partner._id.toString(), partner]),
    );

    const sortedChatPartners = partnerIds
      .map((partnerId) => partnersById.get(partnerId))
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      message: "Chat partners fetched successfully.",
      data: sortedChatPartners,
    });
  } catch (error) {
    console.error("Get chat partners error:", error);
    next(error);
  }
};


/**
 * @name deleteConversation
 * @description Delete all messages exchanged between two users.
 * @access Private
 */
export const deleteConversation = async (req, res, next) => {
  try {
    const currentUserId = req.user.userId;
    const { userId: partnerId } = req.params;

    // Prevent deleting a conversation with yourself.
    if (currentUserId.toString() === partnerId) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete a conversation with yourself.",
      });
    }

    // Ensure the other participant exists.
    const partnerExists = await User.exists({ _id: partnerId });

    if (!partnerExists) {
      return res.status(404).json({
        success: false,
        message: "Chat partner not found.",
      });
    }

    // Delete messages in both directions.
    const result = await Message.deleteMany({
      $or: [
        { sender: currentUserId, receiver: partnerId },
        { sender: partnerId, receiver: currentUserId },
      ],
    });

    // Silently update all active sessions belonging to both users.
    const io = getIO();

    getUserSocketIds(currentUserId.toString()).forEach((socketId) => {
      io.to(socketId).emit("conversationDeleted", {
        partnerId: partnerId.toString(),
      });
    });

    getUserSocketIds(partnerId).forEach((socketId) => {
      io.to(socketId).emit("conversationDeleted", {
        partnerId: currentUserId.toString(),
      });
    });

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully.",
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    console.error("Delete conversation error:", error);
    next(error);
  }
};

