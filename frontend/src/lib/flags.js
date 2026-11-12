/**
 * CHUGLI FRONTEND - Feature Flags & Runtime Configuration
 *
 * Central place for all frontend feature flags. These are logged to the
 * console on app startup so you can confirm every flag is set as intended.
 */

export const FLAGS = {
  // --- Feature flags ---
  ENABLE_REALTIME_MESSAGING: true,
  ENABLE_SOCKET_IO: true,
  ENABLE_CHANNELS: true,
  ENABLE_SERVERS: true,
  ENABLE_VOICE_CHANNELS: true,
  ENABLE_FILE_UPLOAD: true,
  ENABLE_PROFILE_PIC_UPLOAD: true,
  ENABLE_READ_RECEIPTS: true,
  ENABLE_TYPING_INDICATORS: true,
  ENABLE_ONLINE_STATUS: true,
  ENABLE_SOUND_EFFECTS: true,
  ENABLE_OPTIMISTIC_UI: true,
  ENABLE_POLLING_FALLBACK: true,

  // --- Auth ---
  ENABLE_FIREBASE_AUTH: true,
  ENABLE_GOOGLE_AUTH: true,
  ENABLE_MAGIC_LINK_AUTH: true,
  ENABLE_EMAIL_VERIFICATION: true,

  // --- Deployment ---
  NODE_ENV: import.meta.env.MODE || "development",
  BACKEND_URL:
    import.meta.env.VITE_BACKEND_URL || "https://chugli-backend.jayyvarmaa.me",
  FRONTEND_URL: "https://chugli.jayyvarmaa.me",

  // --- Logging ---
  LOG_MAJOR: import.meta.env.VITE_LOG_MAJOR === "true",
  LOG_MINOR: import.meta.env.VITE_LOG_MINOR === "true",
};

/**
 * Log every flag to the console so they are visible and confirmable at startup.
 */
export const logFlags = () => {
  console.log("\n========================================================");
  console.log("  CHUGLI FRONTEND - FEATURE FLAGS & RUNTIME CONFIG");
  console.log("========================================================");
  for (const [key, value] of Object.entries(FLAGS)) {
    const flagValue = typeof value === "boolean" ? (value ? "ON" : "OFF") : value;
    console.log(`   [${typeof value === "boolean" ? (value ? "ON" : "OFF") : "SET"}] ${key}: ${flagValue}`);
  }
  console.log("========================================================\n");
};
