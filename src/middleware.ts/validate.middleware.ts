import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import logger from "../logger/index.js";
import { error } from "node:console";

export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    if (!result.success) {
      logger.warn("Validation error", { error: result.error });
      return res
        .status(400)
        .json({ message: "Validation error", errors: result.error.flatten() });
    }
    next();
  };
