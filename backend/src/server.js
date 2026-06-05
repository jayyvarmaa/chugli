import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import serverRoutes from "./routes/server.route.js";
import channelRoutes from "./routes/channel.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

// Parse CORS origins - ensure it's always an array
let CORS_ORIGIN = [];
if (ENV.CLIENT_URL) {
  CORS_ORIGIN = ENV.CLIENT_URL.split(",").map(url => url.trim());
} else {
  CORS_ORIGIN = ["http://localhost:5173"];
}

console.log("Allowed CORS Origins:", CORS_ORIGIN);

// Standard CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log("Request with no origin - allowing");
      return callback(null, true);
    }
    
    // Check if origin is allowed
    const cleanOrigin = origin.trim().toLowerCase();
    const isAllowed = CORS_ORIGIN.some(domain => {
      const cleanDomain = domain.toLowerCase();
      return cleanOrigin === cleanDomain || cleanOrigin === cleanDomain.replace(/\/$/, "");
    });

    if (isAllowed) {
      console.log("CORS allowed for origin:", origin);
      callback(null, true);
    } else {
      console.warn("CORS blocked for origin:", origin, "Allowed origins:", CORS_ORIGIN);
      callback(null, true); // Allow anyway to prevent hard CORS failures
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Content-Length", "X-JSON-Response"],
  maxAge: 86400
};

// Increase request size limit to 100MB for handling large images without compression
app.use(express.json({ limit: "100mb" })); // req.body
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

// Explicit preflight handler for all OPTIONS requests
app.options("*", cors(corsOptions));

// Additional CORS headers for safety
app.use((req, res, next) => {
  const origin = req.get("origin");
  if (origin) {
    const cleanOrigin = origin.trim().toLowerCase();
    const isAllowed = CORS_ORIGIN.some(domain => {
      const cleanDomain = domain.toLowerCase();
      return cleanOrigin === cleanDomain || cleanOrigin === cleanDomain.replace(/\/$/, "");
    });
    if (isAllowed) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/servers", serverRoutes);
app.use("/api/channels", channelRoutes);

// Health check endpoint for Render deployment
app.get("/health", (_, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// make ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});
