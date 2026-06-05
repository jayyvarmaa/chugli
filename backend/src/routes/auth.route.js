import express from "express";
import { signup, updateProfile, googleAuth } from "../controllers/auth.controller.js";
import { protectRoute, checkAuth } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection);

router.post("/signup", signup);
router.post("/google", googleAuth);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", checkAuth, (req, res) => res.status(200).json(req.user));

export default router;
