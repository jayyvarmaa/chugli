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
let CORS_ORIGIN = ["https://chugli.jayvarma.site"];
if (ENV.CLIENT_URL) {
  const urls = ENV.CLIENT_URL.split(",").map(url => url.trim());
  CORS_ORIGIN = [...CORS_ORIGIN, ...urls];
}

console.log("Allowed CORS Origins:", CORS_ORIGIN);

// Standard CORS options - PERMISSIVE for now to debug
const corsOptions = {
  origin: true, // Accept all origins for now
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Content-Length", "X-JSON-Response"]
};

// Increase request size limit to 100MB for handling large images without compression
app.use(express.json({ limit: "100mb" })); // req.body
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

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
