import express from "express";
import { createChannel, getChannels } from "../controllers/channel.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createChannel);
router.get("/:serverId", protectRoute, getChannels);

export default router;
