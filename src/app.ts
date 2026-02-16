import express from "express";
import cors from "cors";
import { notFound } from "./middleware.ts/notFound.middleware.js";
import { errorHandler } from "./middleware.ts/error.middleware.js";

// import authRoutes from "./modules/auth/auth.route";
// import userRoutes from "./modules/user/user.route";
// import productRoutes from "./modules/product/product.route";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
