import express from "express";
import { signup, login, logout, updateProfile, forgotPassword, verifyResetCode } from "../controllers/auth.controller.js";
import { protectRoute, checkAuth } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", checkAuth, (req, res) => res.status(200).json(req.user));

export default router;
