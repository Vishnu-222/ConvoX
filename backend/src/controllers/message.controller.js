import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../config/cloudinary.js";

/**
 * @name sendMessage
 * @description Send a text message to another user.
 * @access Private
 */
const sendMessage = async (req, res, next) => {
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

export default sendMessage;
