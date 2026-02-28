import app from "./app.js";
import { getEnv } from "./config/env.js";
import { connectDB } from "./database/connectDB.js";
import logger from "./logger/index.js";

(async () => {
  const PORT = getEnv("PORT");
  await connectDB();
  app.listen(PORT, () => logger.info(`Server running on ${PORT}`));
})();
