import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : (import.meta.env.VITE_BACKEND_URL || "https://chugli-backend-d3f9.onrender.com");

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const res = await axiosInstance.get("/auth/check");
        set({ authUser: res.data });
        get().connectSocket();
      } else {
        set({ authUser: null });
      }
    } catch (error) {
      // 401 is expected when user is not logged in - don't log as error
      if (error.response?.status !== 401) {
        console.log("Error in authCheck:", error);
      }
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
      }
      set({ authUser: res.data });

      toast.success("Account created successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
      }
      set({ authUser: res.data });

      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("authToken");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Error logging out");
      console.log("Logout error:", error);
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response.data.message);
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const token = localStorage.getItem("authToken");
    const newSocket = io(BASE_URL, {
      withCredentials: true,
      auth: {
        token: token,
      },
    });

    newSocket.connect();

    set({ socket: newSocket });

    // listen for online users event
    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    // listen for real-time profile picture updates
    newSocket.on("userProfileUpdated", (data) => {
      const { userId, profilePic } = data;
      if (authUser && authUser._id === userId.toString()) {
        const updatedUser = { ...authUser, profilePic };
        set({ authUser: updatedUser });
      }
    });

    // CRITICAL: Global message listener - catches ALL incoming messages
    // This runs regardless of which chat is open or if any chat is open
    newSocket.on("newMessage", (newMessage) => {
      // Import useChatStore here to avoid circular dependency
      const { useChatStore } = require("./useChatStore");
      const store = useChatStore.getState();
      
      // Always update the chat list with unread count and last message
      const senderUserId = newMessage.senderId;
      const currentChats = store.chats;
      const chatIndex = currentChats.findIndex(c => c._id === senderUserId);
      
      if (chatIndex !== -1) {
        // Update chat list incrementally
        let displayText = "";
        if (newMessage.image && !newMessage.text) {
          displayText = "📷 image";
        } else if (newMessage.image && newMessage.text) {
          displayText = newMessage.text.substring(0, 30) + " 📷";
        } else if (newMessage.text) {
          displayText = newMessage.text.substring(0, 35);
        }

        store.updateChatPartnerInList(senderUserId, {
          lastMessage: displayText,
          lastMessageTime: newMessage.createdAt,
          // Increment unread only if not auto-read (chat not active on receiver)
          unreadCount: newMessage.isRead ? 0 : (currentChats[chatIndex].unreadCount || 0) + 1,
        });
      }
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

}));
