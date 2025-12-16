import { tournamentService } from "../di.js";

const updateTournamentStatuses = async () => {
  try {
    // On récupère les tournois
    const tournaments = await tournamentService.getTournamentsToUpdate();
    const now = new Date();

    for (const t of tournaments) {
      // --- 1. GESTION DU DÉMARRAGE (Basé sur la DATE) ---
      // Si on est jour J et qu'il est encore "scheduled", on le passe "live"
      if (t.status === "scheduled" && now >= t.startDate) {
        await tournamentService.updateStatus(t.id, "live");
        console.log(`Tournoi ${t.id} démarré (Date atteinte)`);
        continue; // On passe au suivant
      }

      // --- 2. GESTION DE LA FIN (Basé sur les MATCHS) ---
      // Si le tournoi est "live", on vérifie s'il est fini grâce aux matchs.
      // C'est ta fonction intelligente qui décide, pas la date 2026 !
      if (t.status === "live") {
        const isFinished = await tournamentService.checkAutoCompletion(t.id);

        if (isFinished) {
          console.log(
            `Tournoi ${t.id} terminé automatiquement (Tous matchs joués)`
          );
          continue; // C'est fini pour lui
        }

        // Sécurité date limite (au cas où les matchs ne sont jamais joués)
        // Si on dépasse VRAIMENT la date de fin (2026), on force la fermeture
        if (t.endDate && now > t.endDate) {
          await tournamentService.updateStatus(t.id, "completed");
          console.log(`⌛ Tournoi ${t.id} fermé (Date limite dépassée)`);
        }
      }
    }
  } catch (err) {
    console.error("Erreur Job Tournament :", err);
  }
};

export const startTournamentStatusJob = () => {
  // On peut augmenter l'intervalle (toutes les 5 ou 10 min suffisent)
  setInterval(updateTournamentStatuses, 60000 * 5);
  console.log("Job tournament OK");
};
