import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import mongoose from "mongoose";
import { createLogger } from "../lib/logger.js";

const logger = createLogger("CHAT", false);

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    logger.error("Error in getAllContacts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    logger.error("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, replyToId } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = null;
    let imageWidth = null;
    let imageHeight = null;

    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: "chugli_messages",
          resource_type: "auto",
        });
        imageUrl = uploadResponse.secure_url;
        imageWidth = uploadResponse.width;
        imageHeight = uploadResponse.height;
      } catch (cloudinaryError) {
        logger.error("Cloudinary upload error:", cloudinaryError);
        return res.status(500).json({ error: "Failed to upload image" });
      }
    }

    let resolvedReplyToId = null;
    if (replyToId) {
      const replyExists = await Message.exists({ _id: replyToId });
      if (replyExists) {
        resolvedReplyToId = replyToId;
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
      imageWidth,
      imageHeight,
      replyToId: resolvedReplyToId,
      read: false,
    });

    await newMessage.save();

    // Populate reply message to send back to clients
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("replyToId", "text image senderId");

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      if (isChatActive) {
        newMessage.isRead = true;
        await newMessage.save();
      }

      io.to(receiverSocketId).emit("newMessage", newMessage);
      
      // Only emit unread notification if chat is NOT active
      if (!isChatActive) {
        io.to(receiverSocketId).emit("messageNotification", {
          senderId: senderId,
          receiverId: receiverId,
          message: newMessage,
        });
      } else {
        // Chat is open, send immediate read receipt to sender
        const senderSocketId = getReceiverSocketId(senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit("messageRead", {
            conversationId: receiverId,
            readBy: receiverId,
            messageId: newMessage._id,
          });
        }
      }
    }

    res.status(201).json(newMessage);
  } catch (error) {
    logger.error("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // find all the messages where the logged-in user is either sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");

    // Add last message for each partner
    const chatPartnersWithMessages = await Promise.all(
      chatPartners.map(async (partner) => {
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: loggedInUserId, receiverId: partner._id },
            { senderId: partner._id, receiverId: loggedInUserId },
          ],
        })
          .sort({ createdAt: -1 })
          .select("text image senderId createdAt");

        // Count unread messages from this partner (only count isRead: false)
        const unreadCount = await Message.countDocuments({
          senderId: partner._id,
          receiverId: loggedInUserId,
          isRead: false,
        });

        let displayText = "";
        if (lastMessage) {
          const isCurrentUserSender = lastMessage.senderId.toString() === loggedInUserId.toString();
          const prefix = isCurrentUserSender ? "You: " : "";
          
          // Check if last message is an image or has both text and image
          if (lastMessage.image && !lastMessage.text) {
            displayText = prefix + "📷 image";
          } else if (lastMessage.image && lastMessage.text) {
            displayText = prefix + lastMessage.text.substring(0, 30) + " 📷";
          } else if (lastMessage.text) {
            displayText = prefix + lastMessage.text.substring(0, 35);
          }
        }

        return {
          ...partner.toObject(),
          lastMessage: displayText,
          lastMessageTime: lastMessage ? lastMessage.createdAt : null,
          unreadCount: unreadCount,
        };
      })
    );

    res.status(200).json(chatPartnersWithMessages);
  } catch (error) {
    logger.error("Error in getChatPartners: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const senderId = req.params.senderId;
    const receiverId = req.user._id;

    // Mark all messages from sender to receiver as read (server-side source of truth)
    const result = await Message.updateMany(
      {
        senderId: senderId,
        receiverId: receiverId,
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    // Broadcast read receipt to sender in real-time
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageRead", {
        conversationId: receiverId,
        readBy: receiverId,
        count: result.modifiedCount, // How many messages were marked read
      });
    }

    res.status(200).json({ 
      message: "Messages marked as read",
      markedCount: result.modifiedCount 
    });
  } catch (error) {
    logger.error("Error marking messages as read:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const messages = await Message.find({ channelId }).populate("senderId", "fullName profilePic");
    res.status(200).json(messages);
  } catch (error) {
    logger.error("Error in getChannelMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendChannelMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { channelId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }

    let imageUrl;
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          resource_type: "auto",
          folder: "chugli_messages",
        });
        imageUrl = uploadResponse.secure_url;
      } catch (cloudinaryError) {
        return res.status(500).json({ message: "Failed to upload image" });
      }
    }

    const newMessage = new Message({
      senderId,
      channelId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Populate sender info before broadcasting
    await newMessage.populate("senderId", "fullName profilePic");

    // Broadcast to the channel room via socket.io
    io.to(channelId).emit("newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    logger.error("Error in sendChannelMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
