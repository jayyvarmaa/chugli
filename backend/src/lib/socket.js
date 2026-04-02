import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const CORS_ORIGIN = ENV.CLIENT_URL || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: [CORS_ORIGIN],
    credentials: true,
  },
});

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

// we will use this function to check if the user is online or not
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// this is for storig online users
const userSocketMap = {}; // {userId:socketId}
const userActiveChatMap = {}; // {userId:chatPartnerId} - tracks which chat user has open

io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // CRITICAL: Track which chat user currently has open
  // Prevents messages from incrementing unread if chat is active
  socket.on("openChat", (chatPartnerId) => {
    userActiveChatMap[userId] = chatPartnerId;
    console.log(`${socket.user.fullName} opened chat with ${chatPartnerId}`);
  });

  // Clean up when user closes chat
  socket.on("closeChat", () => {
    delete userActiveChatMap[userId];
    console.log(`${socket.user.fullName} closed chat`);
  });

  // Listen for typing indicator
  socket.on("typing", (data) => {
    const receiverSocketId = getReceiverSocketId(data.recipientId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", {
        userId: userId,
        isTyping: data.isTyping,
      });
    }
  });

  // with socket.on we listen for events from clients
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    delete userActiveChatMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Export active chat tracking for message controller
export function getUserActiveChat(userId) {
  return userActiveChatMap[userId];
}

export { io, app, server };
