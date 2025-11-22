import { tournamentService } from "../di.js";

const updateTournamentStatuses = async () => {
  try {
    const tournaments = await tournamentService.getTournamentsToUpdate();
    const now = new Date();

    for (const t of tournaments) {
      let newStatus = t.status;

      if (now < t.startDate) {
        newStatus = "scheduled";
      } else if (now >= t.startDate && (!t.endDate || now <= t.endDate)) {
        newStatus = "live";
      } else if (t.endDate && now > t.endDate) {
        newStatus = "completed";
      }

      if (newStatus !== t.status) {
        await tournamentService.updateStatus(t.id, newStatus);
        console.log(`Tournoi ${t.id} statut mis à jour → ${newStatus}`);
      }
    }
  } catch (err) {
    console.error("Erreur mise à jour des statuts des tournois :", err);
  }
};

export const startTournamentStatusJob = () => {
  setInterval(updateTournamentStatuses, 60000);
  console.log("Job tournament OK");
};
