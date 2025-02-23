import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth.routes.js";
import deploymentRoutes from "./routes/deployment.routes.js";

const app = express();

app.use(cors());
app.use(json());

// Mount routes under /api
app.use("/api/auth", authRoutes);
app.use("/api/deploy", deploymentRoutes);

export default app;
