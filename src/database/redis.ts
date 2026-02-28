import { getEnv } from "../config/env.js";
import Redis from "ioredis";

export const redis = new Redis(getEnv("REDIS_URL"), {
  maxRetriesPerRequest: 2,
  enableReadyCheck: true,
});
