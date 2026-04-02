import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io, getUserActiveChat } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return res.status(400).json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let imageUrl;
    if (image) {
      try {
        // Upload without any compression - keep original quality
        const uploadResponse = await cloudinary.uploader.upload(image, {
          resource_type: "auto",
          folder: "chugli_messages",
        });
        imageUrl = uploadResponse.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return res.status(500).json({ 
          message: "Failed to upload image",
          error: cloudinaryError.message 
        });
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // CRITICAL: Check if receiver currently has THIS chat open
      // Per spec: "IF recipient.activeConversationId != this.conversationId OR recipient.appState != FOREGROUND THEN increment"
      const receiverActiveChat = getUserActiveChat(receiverId.toString());
      const isChatActive = receiverActiveChat === senderId.toString();
      
      // If receiver has the chat open, auto-mark as read (they're actively reading)
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
    console.log("Error in sendMessage controller: ", error.message);
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
    console.error("Error in getChatPartners: ", error.message);
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
    console.error("Error marking messages as read:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
