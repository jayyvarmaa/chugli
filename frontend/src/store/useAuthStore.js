import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { auth } from "../lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from "firebase/auth";
import { createLogger } from "../lib/logger";

const logger = createLogger("AUTH", true);

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : (import.meta.env.VITE_BACKEND_URL || "https://chugli-backend.jayvarma.site");

export const useAuthStore = create((set, get) => ({
  authUser: null,
  firebaseUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  initAuthListener: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        set({ firebaseUser: user });
        await get().checkAuth();
      } else {
        set({ firebaseUser: null, authUser: null, isCheckingAuth: false });
        get().disconnectSocket();
      }
    });
  },

  checkAuth: async () => {
    try {
      const { firebaseUser } = get();
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        // Update axios default headers
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const res = await axiosInstance.get("/auth/check");
        set({ authUser: res.data });
        get().connectSocket();
      } else {
        set({ authUser: null });
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        logger.error("Error in authCheck:", error);
      }
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const token = await userCredential.user.getIdToken();
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const res = await axiosInstance.post("/auth/signup", {
        firebaseUid: userCredential.user.uid,
        email: data.email,
        fullName: data.fullName
      });
      
      // Send Email Verification
      await sendEmailVerification(userCredential.user);
      
      set({ authUser: res.data });
      toast.success("Account created! Please check your email to verify your account.");
      get().connectSocket();
    } catch (error) {
      if (error.code) {
        toast.error(error.message); // Firebase error
      } else {
        toast.error(error.response?.data?.message || "Error signing up");
      }
    } finally {
      set({ isSigningUp: false });
    }
  },

  signInWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const res = await axiosInstance.post("/auth/google", {
        firebaseUid: result.user.uid,
        email: result.user.email,
        fullName: result.user.displayName,
        profilePic: result.user.photoURL,
      });

      set({ authUser: res.data });
      toast.success("Signed in with Google successfully!");
      get().connectSocket();
    } catch (error) {
      logger.error("Google sign in error:", error);
      toast.error(error.message || "Error signing in with Google");
    }
  },

  sendEmailLink: async (email) => {
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      toast.success("Magic link sent! Check your inbox.");
    } catch (error) {
      logger.error("Error sending email link:", error);
      toast.error(error.message || "Error sending magic link");
    }
  },

  verifyEmailLink: async (url, email) => {
    if (isSignInWithEmailLink(auth, url)) {
      try {
        const result = await signInWithEmailLink(auth, email, url);
        window.localStorage.removeItem('emailForSignIn');
        const token = await result.user.getIdToken();
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Sync with our backend using the /auth/google endpoint which creates missing users
        const res = await axiosInstance.post("/auth/google", {
          firebaseUid: result.user.uid,
          email: result.user.email,
          fullName: result.user.displayName,
          profilePic: result.user.photoURL,
        });

        set({ authUser: res.data });
        toast.success("Signed in with magic link successfully!");
        get().connectSocket();
        return true;
      } catch (error) {
        logger.error("Error verifying email link:", error);
        toast.error(error.message || "Invalid or expired link");
        return false;
      }
    }
    return false;
  },

  forgotPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      logger.error("Forgot password error:", error);
      toast.error(error.message || "Error sending reset email");
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      if (!userCredential.user.emailVerified) {
        toast.error("Please verify your email address.");
      } else {
        toast.success("Logged in successfully");
      }
    } catch (error) {
      toast.error(error.message || "Error logging in");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged handles clearing state
      toast.success("Logged out successfully");
    } catch (error) {
      logger.error("Logout error:", error);
      toast.error("Error logging out");
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      logger.error("Error in update profile:", error);
      toast.error(error.response?.data?.message || "Error updating profile");
    }
  },

  connectSocket: async () => {
    const { authUser, firebaseUser } = get();
    if (!authUser || get().socket?.connected) return;

    const token = await firebaseUser.getIdToken();
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

    newSocket.on("newMessage", async (newMessage) => {
      const { useChatStore } = await import("./useChatStore");
      const store = useChatStore.getState();
      
      const senderUserId = newMessage.senderId;
      const currentChats = store.chats;
      const chatIndex = currentChats.findIndex(c => c._id === senderUserId);
      
      if (chatIndex !== -1) {
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
          unreadCount: newMessage.isRead ? 0 : (currentChats[chatIndex].unreadCount || 0) + 1,
        });
      }
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

}));
