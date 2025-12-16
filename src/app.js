import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import helmet from "helmet";

dotenv.config();

// Configuration pour __dirname en ES Modules (nécessaire pour les images)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// HELMET
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS
const corsOptions = {
  origin: process.env.CLIENT_URL, // Charge depuis le .env
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type", "Authorization"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", router);

app.use(errorHandler);

export default app;
