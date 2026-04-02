import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,
  isTyping: false, // Track if selected user is typing

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      // Sort: prioritize unread conversations at top, then by most recent message (WhatsApp behavior)
      const sortedChats = res.data.sort((a, b) => {
        // FIRST: Conversations with unread messages float to top
        if ((a.unreadCount > 0) !== (b.unreadCount > 0)) {
          return b.unreadCount > 0 ? 1 : -1;
        }
        // SECOND: Within each group, sort by most recent message timestamp
        const aTime = a.lastMessageTime ? new Date(a.lastMessageTime) : new Date(0);
        const bTime = b.lastMessageTime ? new Date(b.lastMessageTime) : new Date(0);
        return bTime - aTime;
      });
      set({ chats: sortedChats });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // OPTIMIZED: Update a single chat in the list without reloading everything
  // This prevents the entire chat list from blinking/reloading on every message
  updateChatPartnerInList: (chatPartnerId, updates) => {
    const { chats } = get();
    const updatedChats = chats.map((chat) =>
      chat._id === chatPartnerId ? { ...chat, ...updates } : chat
    );
    
    // Re-sort after update to move unread chats to top if needed
    const sortedChats = updatedChats.sort((a, b) => {
      if ((a.unreadCount > 0) !== (b.unreadCount > 0)) {
        return b.unreadCount > 0 ? 1 : -1;
      }
      const aTime = a.lastMessageTime ? new Date(a.lastMessageTime) : new Date(0);
      const bTime = b.lastMessageTime ? new Date(b.lastMessageTime) : new Date(0);
      return bTime - aTime;
    });
    
    set({ chats: sortedChats });
  },

  markMessagesAsRead: async (userId) => {
    try {
      await axiosInstance.put(`/messages/mark-as-read/${userId}`);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages, chats } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    
    // Optimistic update: add message to messages array
    set({ messages: [...messages, optimisticMessage] });

    // OPTIMIZED: Do incremental chat list update instead of full reload
    // Calculate display text
    let displayText = "";
    if (messageData.image && !messageData.text) {
      displayText = "You: 📷 image";
    } else if (messageData.image && messageData.text) {
      displayText = "You: " + messageData.text.substring(0, 30) + " 📷";
    } else if (messageData.text) {
      displayText = "You: " + messageData.text.substring(0, 35);
    }

    get().updateChatPartnerInList(selectedUser._id, {
      lastMessage: displayText,
      lastMessageTime: new Date().toISOString(),
    });

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      // Use current state, not captured reference, to properly replace optimistic message
      const currentMessages = get().messages;
      const updatedMessages = currentMessages.map((msg) =>
        msg._id === tempId ? res.data : msg
      );
      set({ messages: updatedMessages });
    } catch (error) {
      // Remove optimistic message on failure
      const currentMessages = get().messages;
      const filteredMessages = currentMessages.filter(msg => msg._id !== tempId);
      set({ messages: filteredMessages });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessage] });

      // OPTIMIZED: Update just this chat without reloading entire list
      // Extract last message text and update unread count incrementally
      let displayText = "";
      if (newMessage.image && !newMessage.text) {
        displayText = "📷 image";
      } else if (newMessage.image && newMessage.text) {
        displayText = newMessage.text.substring(0, 30) + " 📷";
      } else if (newMessage.text) {
        displayText = newMessage.text.substring(0, 35);
      }

      get().updateChatPartnerInList(selectedUser._id, {
        lastMessage: displayText,
        lastMessageTime: newMessage.createdAt,
        // Don't increment unread if message auto-marked as read (chat is active)
        unreadCount: newMessage.isRead ? 0 : (get().chats.find(c => c._id === selectedUser._id)?.unreadCount || 0) + 1,
      });

      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound.play().catch((e) => console.log("Audio play failed:", e));
      }
    });

    // Listen for incoming messages from any user (for real-time unread badge updates)
    socket.on("messageNotification", (data) => {
      // OPTIMIZED: Only update the specific chat that has new unread count
      const chats = get().chats;
      const chatIndex = chats.findIndex(c => c._id === data.senderId);
      
      if (chatIndex !== -1) {
        get().updateChatPartnerInList(data.senderId, {
          unreadCount: (chats[chatIndex].unreadCount || 0) + 1,
          lastMessage: data.message?.text || "📷 image",
          lastMessageTime: data.message?.createdAt,
        });
      }
    });

    // Listen for read receipts (when sender sees their message was read)
    socket.on("messageRead", (data) => {
      // OPTIMIZED: Just reset unread count for this conversation
      get().updateChatPartnerInList(data.conversationId, {
        unreadCount: 0,
      });
    });

    // Listen for typing indicator
    socket.on("userTyping", (data) => {
      if (data.userId === selectedUser._id) {
        set({ isTyping: data.isTyping });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageNotification");
    socket.off("messageRead");
    socket.off("userTyping");
  },

  sendTypingIndicator: (isTyping) => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    socket.emit("typing", {
      recipientId: selectedUser._id,
      isTyping: isTyping,
    });
  },
}));
