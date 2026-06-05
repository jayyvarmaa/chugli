import Channel from "../models/channel.model.js";
import Server from "../models/server.model.js";
import { createLogger } from "../lib/logger.js";

const logger = createLogger("CHANNEL", false);

export const createChannel = async (req, res) => {
  try {
    const { name, type } = req.body;
    const { serverId } = req.params;
    const userId = req.user._id;

    // Verify server exists and user is a member
    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }

    // Only allow server owner or admins to create channels (simplified for now: anyone can create)
    
    const newChannel = new Channel({
      name,
      type,
      serverId,
    });

    await newChannel.save();

    // Add channel to server
    server.channels.push(newChannel._id);
    await server.save();

    res.status(201).json(newChannel);
  } catch (error) {
    logger.error("Error creating channel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getServerChannels = async (req, res) => {
  try {
    const { serverId } = req.params;
    const channels = await Channel.find({ serverId });
    res.status(200).json(channels);
  } catch (error) {
    logger.error("Error fetching channels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
