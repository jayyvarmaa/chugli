import express from "express";
import { createServer, getServers, joinServer, getServerMembers } from "../controllers/server.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createServer);
router.get("/", protectRoute, getServers);
router.post("/join/:serverId", protectRoute, joinServer);
router.get("/:serverId/members", protectRoute, getServerMembers);

export default router;
