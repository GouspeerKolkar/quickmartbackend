import express, { Request, Response } from "express";
import { logger } from "./logger/index.js";
import { connectDB } from "./database/connectDB.js";
import { getEnv } from "./config/env.js";

const app = express();
const PORT = Number(getEnv("PORT", "3000"));

app.use(express.json());

// 🔥 connect DB before starting server
await connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to QuickMart API!");
});

// server listening
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
