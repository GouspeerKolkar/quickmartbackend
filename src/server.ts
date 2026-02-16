import app from "./app.js";
import { getEnv } from "./config/env.js";
import { connectDB } from "./database/connectDB.js";

(async () => {
  const PORT = getEnv("PORT");
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
})();
