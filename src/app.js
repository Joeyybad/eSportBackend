import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js"; // adapte si ton fichier routes s'appelle différemment

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);

export default app; // ⚠️ Bien exporter l'instance Express
