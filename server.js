// server.js
import express from "express";
import dotenv from "dotenv";
import app from "./src/app.js";
import { sequelize } from "./src/config/database.js";
import path from "path";
import { fileURLToPath } from "url";
import { startMatchStatusJob } from "./src/jobs/updateMatchStatus.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

dotenv.config();
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données réussie.");

    //Synchronisation forcée pour mise à jour des relations
    await sequelize.sync({ alter: true });
    console.log("Base de données synchronisée (tables recréées).");

    app.listen(PORT, () => {
      console.log(`Serveur lancé sur le port ${PORT}`);
    });
  } catch (error) {
    console.error("Erreur lors du démarrage du serveur :", error);
  }
}

startServer();
startMatchStatusJob();
