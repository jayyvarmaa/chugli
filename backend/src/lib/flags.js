/**
 * CHUGLI BACKEND - Feature Flags & Runtime Configuration
 *
 * Central place for all feature flags. These are logged to the console
 * on server startup so you can confirm every flag is set as intended.
 */
import { ENV } from './env.js';

export const FLAGS = {
  // --- Feature flags ---
  ENABLE_SOCKET_IO: true,
  ENABLE_REALTIME_MESSAGING: true,
  ENABLE_CHANNELS: true,
  ENABLE_SERVERS: true,
  ENABLE_VOICE_CHANNELS: true,
  ENABLE_FILE_UPLOAD: true,
  ENABLE_PROFILE_PIC_UPLOAD: true,
  ENABLE_READ_RECEIPTS: true,
  ENABLE_TYPING_INDICATORS: true,
  ENABLE_ONLINE_STATUS: true,

  // --- Security / middleware ---
  CORS_ENABLED: true,
  COOKIE_PARSER_ENABLED: true,
  ARCJET_PROTECTION_ENABLED: !!ENV.ARCJET_KEY,
  FIREBASE_AUTH_ENABLED: !!(
    ENV.FIREBASE_PROJECT_ID &&
    ENV.FIREBASE_CLIENT_EMAIL &&
    ENV.FIREBASE_PRIVATE_KEY
  ),

  // --- Logging ---
  LOG_MAJOR: ENV.LOG_MAJOR,
  LOG_MINOR: ENV.LOG_MINOR,

  // --- Deployment ---
  NODE_ENV: ENV.NODE_ENV,
  PORT: ENV.PORT,
  CLIENT_URL: ENV.CLIENT_URL || "http://localhost:5173",
  BACKEND_URL: "https://chugli-backend.jayyvarmaa.me",
};

/**
 * Log every flag to the console so they are visible and confirmable at startup.
 */
export const logFlags = () => {
  console.log("\n========================================================");
  console.log("  CHUGLI BACKEND - FEATURE FLAGS & RUNTIME CONFIG");
  console.log("========================================================");
  for (const [key, value] of Object.entries(FLAGS)) {
    const flagValue = typeof value === "boolean" ? (value ? "ON" : "OFF") : value;
    console.log(`   [${typeof value === "boolean" ? (value ? "ON" : "OFF") : "SET"}] ${key}: ${flagValue}`);
  }
  console.log("========================================================\n");
};
