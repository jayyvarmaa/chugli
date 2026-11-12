import User from "../models/User.js";
import { firebaseAdmin, firebaseInitialized } from "../lib/firebase.js";

export const protectRoute = async (req, res, next) => {
  try {
    if (!firebaseInitialized) {
      return res.status(503).json({
        message: "Auth service unavailable - Firebase not configured on server",
      });
    }

    let token = req.cookies.jwt || req.cookies.authToken;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }
    }

    if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" });

    // Verify Firebase ID Token
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    if (!decodedToken) return res.status(401).json({ message: "Unauthorized - Invalid token" });

    // Find user by firebaseUid
    const user = await User.findOne({ firebaseUid: decodedToken.uid }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error);
    res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
  }
};

export const checkAuth = async (req, res, next) => {
  try {
    if (!firebaseInitialized) {
      return res.status(200).json(null);
    }

    let token = req.cookies.jwt || req.cookies.authToken;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }
    }

    if (!token) return res.status(200).json(null);

    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    if (!decodedToken) return res.status(200).json(null);

    const user = await User.findOne({ firebaseUid: decodedToken.uid }).select("-password");
    if (!user) return res.status(200).json(null);

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in checkAuth middleware:", error);
    res.status(200).json(null);
  }
};
