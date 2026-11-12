import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import serverRoutes from "./routes/server.route.js";
import channelRoutes from "./routes/channel.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { FLAGS, logFlags } from "./lib/flags.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// backend/src -> project root
const PROJECT_ROOT = path.resolve(__dirname, "../..");

const PORT = ENV.PORT || 3000;

// Parse CORS origins - ensure it's always an array
let CORS_ORIGIN = ["https://chugli.jayyvarmaa.me"];
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

// Health check endpoint
app.get("/health", (_, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Root API info
app.get("/api", (_, res) => {
  res.status(200).json({
    name: "chugli-backend",
    version: "1.0.0",
    status: "online",
    endpoints: ["/api/auth", "/api/messages", "/api/servers", "/api/channels"],
  });
});

// Note: Frontend static assets are served by the separate frontend Vercel deployment
// at https://chugli.jayyvarmaa.me. This backend project only serves the API.

// Confirm all feature flags in the console before the server starts accepting traffic
logFlags();

// Only start listening when run directly (not when imported as a Vercel serverless handler)
const isDirectRun =
  import.meta.url === `file://${process.argv[1]}`;

if (isDirectRun) {
  server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
    console.log(`Backend URL: ${FLAGS.BACKEND_URL}`);
    console.log(`Frontend URL: ${FLAGS.CLIENT_URL}`);
    connectDB();
  });
}

// Export the Express app for use as a serverless handler (e.g. on Vercel)
export { app, server, connectDB, ENV, FLAGS, PROJECT_ROOT };
