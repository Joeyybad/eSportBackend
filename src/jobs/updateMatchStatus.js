import Match from "../models/matchModel.js";

const MATCH_DURATION = 120; // 2 heures

const updateMatchStatuses = async () => {
  try {
    const now = new Date();

    // Récupérer tous les matchs qui ne sont pas encore "completed"
    const matches = await Match.findAll({
      where: {
        status: ["scheduled", "live"],
      },
    });

    for (const match of matches) {
      const matchStart = new Date(match.date);
      const matchEnd = new Date(matchStart.getTime() + MATCH_DURATION * 60000);

      let newStatus = match.status;

      if (now >= matchStart && now <= matchEnd) {
        newStatus = "live";
      } else if (now > matchEnd) {
        newStatus = "completed";
      } else {
        newStatus = "scheduled";
      }

      if (newStatus !== match.status) {
        match.status = newStatus;
        await match.save();
        console.log(`Match ${match.id} statut mis à jour → ${newStatus}`);
      }
    }
  } catch (err) {
    console.error("Erreur mise à jour des statuts :", err);
  }
};

// Lance le job toutes les 1 minute
export const startMatchStatusJob = () => {
  setInterval(updateMatchStatuses, 60 * 1000);
  console.log("Job de mise à jour des statuts de match lancé");
};
