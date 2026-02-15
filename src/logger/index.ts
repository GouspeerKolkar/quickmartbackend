import { isProduction } from "../config/env.js";
import { developmentLogger } from "./development.js";
import { productionLogger } from "./production.js";

export const logger = isProduction() ? productionLogger : developmentLogger;
