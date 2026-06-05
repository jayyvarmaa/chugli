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

const CORS_ORIGIN = ENV.CLIENT_URL ? ENV.CLIENT_URL.split(",") : "http://localhost:5173";

// Standard CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    const isAllowed = CORS_ORIGIN.some(domain => {
      const cleanDomain = domain.trim().toLowerCase();
      const cleanOrigin = origin.trim().toLowerCase();
      return cleanOrigin === cleanDomain || cleanOrigin === cleanDomain.replace(/\/$/, "");
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn("CORS blocked for origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
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
