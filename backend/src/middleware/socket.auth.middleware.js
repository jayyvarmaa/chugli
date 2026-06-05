import User from "../models/User.js";
import { firebaseAdmin } from "../lib/firebase.js";
import { createLogger } from "../lib/logger.js";

const logger = createLogger("WEBRTC", true);

export const socketAuthMiddleware = async (socket, next) => {
  try {
    let token = socket.handshake.auth?.token;

    if (!token) {
      const authHeader = socket.handshake.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }
    }

    if (!token) {
      token = socket.handshake.headers.cookie
        ?.split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];
    }

    if (!token) {
      logger.log("Socket connection rejected: No token provided");
      return next(new Error("Unauthorized - No Token Provided"));
    }

    // Verify Firebase token
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    if (!decodedToken) {
      logger.log("Socket connection rejected: Invalid token");
      return next(new Error("Unauthorized - Invalid Token"));
    }

    const user = await User.findOne({ firebaseUid: decodedToken.uid }).select("-password");
    if (!user) {
      logger.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }

    socket.user = user;
    socket.userId = user._id.toString();

    logger.log(`Socket authenticated for user: ${user.fullName} (${user._id})`);

    next();
  } catch (error) {
    logger.error("Error in socket authentication:", error.message);
    next(new Error("Unauthorized - Authentication failed"));
  }
};
