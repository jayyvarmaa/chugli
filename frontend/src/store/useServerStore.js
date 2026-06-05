import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { createLogger } from "../lib/logger";

const logger = createLogger("SERVER", false);

export const useServerStore = create((set, get) => ({
  servers: [],
  isLoadingServers: false,
  isCreatingServer: false,
  
  getServers: async () => {
    set({ isLoadingServers: true });
    try {
      const res = await axiosInstance.get("/servers");
      set({ servers: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch servers");
    } finally {
      set({ isLoadingServers: false });
    }
  },

  createServer: async (serverData) => {
    set({ isCreatingServer: true });
    try {
      const res = await axiosInstance.post("/servers", serverData);
      set((state) => ({ servers: [...state.servers, res.data] }));
      toast.success("Server created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create server");
    } finally {
      set({ isCreatingServer: false });
    }
  },

  joinServer: async (serverId) => {
    set({ isCreatingServer: true });
    try {
      const res = await axiosInstance.post(`/servers/join/${serverId}`);
      set((state) => ({ servers: [...state.servers, res.data] }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join server");
      throw error;
    } finally {
      set({ isCreatingServer: false });
    }
  },

  activeServerChannels: [],
  isLoadingChannels: false,
  isCreatingChannel: false,

  getChannels: async (serverId) => {
    set({ isLoadingChannels: true });
    try {
      const res = await axiosInstance.get(`/channels/${serverId}`);
      set({ activeServerChannels: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch channels");
    } finally {
      set({ isLoadingChannels: false });
    }
  },

  createChannel: async (channelData) => {
    set({ isCreatingChannel: true });
    try {
      const res = await axiosInstance.post(`/channels`, channelData);
      set((state) => ({ activeServerChannels: [...state.activeServerChannels, res.data] }));
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create channel");
      return null;
    } finally {
      set({ isCreatingChannel: false });
    }
  },

  getServerMembers: async (serverId) => {
    try {
      const res = await axiosInstance.get(`/servers/${serverId}/members`);
      return res.data;
    } catch (error) {
      logger.error(error);
      return [];
    }
  },
}));
