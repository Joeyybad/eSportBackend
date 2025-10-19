import dotenv from "dotenv";
import app from "./src/app.js";
import { sequelize } from "./src/config/database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Synchronisation Sequelize + lancement du serveur
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion à la base de données réussie.");

    await sequelize.sync(); // crée les tables si elles n’existent pas
    console.log("📦 Base de données synchronisée.");

    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur le port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erreur lors du démarrage du serveur :", error);
  }
}

startServer();
