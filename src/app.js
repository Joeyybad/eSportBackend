import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middlewares globaux
const corsOptions = {
  //Port Frontend
  origin: "http://localhost:5173",

  //gestion des tokens, cookies
  credentials: true,

  // Méthodes autorisées
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api", router);

// Error Handler global
app.use(errorHandler);

export default app;
