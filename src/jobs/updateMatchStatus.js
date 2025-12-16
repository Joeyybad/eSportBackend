import { matchService } from "../di.js";

// Durée estimée d'un match en minutes.
// Sert de seuil de sécurité pour passer automatiquement un match en "completed"
// ou pour déclencher des alertes si le match dépasse cette durée sans résultat.
const MATCH_DURATION_MINUTES = 120;

const updateMatchStatuses = async () => {
  try {
    const matches = await matchService.getMatchesToUpdate();
    const now = new Date();

    for (const match of matches) {
      const start = new Date(match.date);
      const end = new Date(start.getTime() + MATCH_DURATION_MINUTES * 60000);

      let newStatus = match.status;

      // 1. Passage en LIVE
      if (match.status === "scheduled" && now >= start) {
        newStatus = "live";
      }

      // 2. Passage en COMPLETED (Automatique par le temps)
      // Cela indique aux visiteurs que le match est fini.
      if (newStatus === "live" && now > end) {
        newStatus = "completed";
      }

      // On met à jour seulement si ça a changé
      if (newStatus !== match.status) {
        // Attention : On ne met QUE le statut à jour, pas le vainqueur
        await matchService.updateStatus(match.id, newStatus);
        console.log(`Match ${match.id} passé automatiquement en ${newStatus}`);
      }
    }
  } catch (err) {
    console.error("Erreur job match:", err);
  }
};

export const startMatchStatusJob = () => {
  setInterval(updateMatchStatuses, 60000);
  console.log("Job match (Temps & Statuts) OK");
};
