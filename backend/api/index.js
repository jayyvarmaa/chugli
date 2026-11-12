import { app, connectDB } from "../src/server.js";

// Connect to MongoDB when the serverless environment initializes.
// Mongoose caches the connection globally, so subsequent invocations reuse it.
connectDB().catch((error) => {
  console.error("[VERCEL] MongoDB connection failed:", error.message);
});

// Export the Express app as the Vercel serverless handler.
// All REST routes (/api/...) defined in src/server.js are available.
export default app;
