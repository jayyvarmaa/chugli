import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" });

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: "Unauthorized - Invalid token" });

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Soft auth for check endpoint - returns 200 with null instead of 401
export const checkAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(200).json(null);

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) return res.status(200).json(null);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(200).json(null);

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in checkAuth middleware:", error);
    res.status(200).json(null);
  }
};
