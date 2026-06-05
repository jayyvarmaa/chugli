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

io.use(socketAuthMiddleware);

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {}; // {userId:socketId}
const userActiveChatMap = {}; // {userId:chatPartnerIdOrChannelId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName);
  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("openChat", (chatId) => {
    userActiveChatMap[userId] = chatId;
    socket.join(chatId); // Join a room for the channel or DM
    console.log(`${socket.user.fullName} joined chat/channel ${chatId}`);
  });

  socket.on("closeChat", (chatId) => {
    delete userActiveChatMap[userId];
    if (chatId) socket.leave(chatId);
    console.log(`${socket.user.fullName} left chat/channel`);
  });

  socket.on("typing", (data) => {
    if (data.channelId) {
      socket.to(data.channelId).emit("userTyping", {
        userId: userId,
        isTyping: data.isTyping,
      });
    } else {
      const receiverSocketId = getReceiverSocketId(data.recipientId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userTyping", {
          userId: userId,
          isTyping: data.isTyping,
        });
      }
    }
  });

  // --- WebRTC Signaling ---
  socket.on("joinVoiceChannel", (channelId) => {
    socket.join(`voice-${channelId}`);
    socket.to(`voice-${channelId}`).emit("userJoinedVoice", { userId, socketId: socket.id });
    console.log(`${socket.user.fullName} joined voice channel ${channelId}`);
  });

  socket.on("leaveVoiceChannel", (channelId) => {
    socket.leave(`voice-${channelId}`);
    socket.to(`voice-${channelId}`).emit("userLeftVoice", { userId, socketId: socket.id });
    console.log(`${socket.user.fullName} left voice channel ${channelId}`);
  });

  // Relay WebRTC signals
  socket.on("webrtcSignal", (data) => {
    // data: { targetSocketId, signal }
    io.to(data.targetSocketId).emit("webrtcSignal", {
      senderSocketId: socket.id,
      senderUserId: userId,
      signal: data.signal
    });
  });
  // -------------------------

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    delete userActiveChatMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export function getUserActiveChat(userId) {
  return userActiveChatMap[userId];
}

export { io, app, server };
