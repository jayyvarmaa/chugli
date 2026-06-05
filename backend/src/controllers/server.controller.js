import Server from "../models/server.model.js";
import Channel from "../models/channel.model.js";
import { createLogger } from "../lib/logger.js";

const logger = createLogger("SERVER", false);

export const createServer = async (req, res) => {
  const { name, icon } = req.body;
  const ownerId = req.user._id;

  try {
    if (!name) {
      return res.status(400).json({ message: "Server name is required" });
    }

    const newServer = new Server({
      name,
      icon: icon || "",
      ownerId,
      members: [ownerId], // Owner is the first member
    });

    const savedServer = await newServer.save();

    // Automatically create a "general" text channel
    const defaultChannel = new Channel({
      name: "general",
      type: "text",
      serverId: savedServer._id,
    });
    await defaultChannel.save();

    // Automatically create a "General Voice" channel
    const defaultVoiceChannel = new Channel({
      name: "General Voice",
      type: "voice",
      serverId: savedServer._id,
    });
    await defaultVoiceChannel.save();

    res.status(201).json(savedServer);
  } catch (error) {
    logger.error("Error creating server:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getServers = async (req, res) => {
  const userId = req.user._id;

  try {
    const servers = await Server.find({ members: userId });
    res.status(200).json(servers);
  } catch (error) {
    logger.error("Error fetching servers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const joinServer = async (req, res) => {
  const userId = req.user._id;
  const { serverId } = req.params;

  try {
    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }

    if (server.members.includes(userId)) {
      return res.status(400).json({ message: "You are already a member of this server" });
    }

    server.members.push(userId);
    await server.save();

    res.status(200).json(server);
  } catch (error) {
    logger.error("Error joining server:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getServerMembers = async (req, res) => {
  const { serverId } = req.params;
  try {
    const server = await Server.findById(serverId).populate("members", "fullName profilePic");
    if (!server) return res.status(404).json({ message: "Server not found" });

    res.status(200).json(server.members);
  } catch (error) {
    logger.error("Error fetching members:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
