import mongoose from "mongoose";
import { getEnv } from "../config/env.js";
import logger from "../logger/index.js";

export async function connectDB(): Promise<void> {
  try {
    const uri = getEnv("MONGO_URI");

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, 
    });

    logger.info("✅ MongoDB connected successfully");
  } catch (error) {
    logger.error(
      `❌ MongoDB connection failed: ${
        error instanceof Error ? error.message : error
      }`,
    );
    process.exit(1);
  }
}
