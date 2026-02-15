import winston from "winston";
import { getEnv } from "../config/env.js";

export const productionLogger = winston.createLogger({
  level: getEnv("LOG_LEVEL", "info"),
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});
