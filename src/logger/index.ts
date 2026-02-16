import { Logger } from "winston";
import { isProduction, NODE_ENV } from "../config/env.js";
import productionLogger from "./production.js";
import developmentLogger from "./development.js";

// Always create a logger (never null)
let logger: Logger;

if (isProduction()) {
  logger = productionLogger();
} else {
  logger = developmentLogger();
}

// Optional: log once which logger is active
logger.info(`Logger initialized for environment: ${NODE_ENV}`);

export default logger;
