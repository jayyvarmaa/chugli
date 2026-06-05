import mongoose from "mongoose";
import { createLogger } from "./logger.js";
import { ENV } from "./env.js";

const logger = createLogger("DB", true);

export const connectDB = async () => {
  try {
    const { MONGO_URI } = ENV;
    if (!MONGO_URI) throw new Error("MONGO_URI is not set");

    const conn = await mongoose.connect(MONGO_URI);
    logger.log("MONGODB CONNECTED:", conn.connection.host);
  } catch (error) {
    logger.error("Error connection to MONGODB:", error);
    process.exit(1); // 1 status code means fail, 0 means success
  }
};
