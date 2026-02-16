import { Request, Response } from "express";
import logger from "../logger/index.js";
export function notFound(req: Request, res: Response) {
  logger.warn("Route not found", { origin: req.originalUrl });
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}
