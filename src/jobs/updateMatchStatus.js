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

      let status = "scheduled";
      if (now >= start && now <= end) status = "live";
      if (now > end) status = "completed";

      if (status !== match.status) {
        await matchService.updateStatus(match.id, status);
        console.log(`Match ${match.id} mis à jour → ${status}`);
      }
    }
  } catch (err) {
    console.error("Erreur job match:", err);
  }
};

export const startMatchStatusJob = () => {
  setInterval(updateMatchStatuses, 60000);
  console.log("Job match OK");
};
