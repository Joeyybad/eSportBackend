import {
  Tournament as TournamentModel,
  Match as MatchModel,
  Team as TeamModel,
} from "../models/index.js";
import Tournament from "../domain/Tournament.js";

class TournamentService {
  async getAll() {
    const rows = await TournamentModel.findAll();
    return rows.map((row) => new Tournament(row.toJSON()));
  }

  async getById(id) {
    const row = await TournamentModel.findByPk(id);
    return row ? new Tournament(row.toJSON()) : null;
  }

  async create(data) {
    const row = await TournamentModel.create(data);
    return new Tournament(row.toJSON());
  }

  async update(id, data) {
    const row = await TournamentModel.findByPk(id);
    if (!row) return null;

    await row.update(data);
    return new Tournament(row.toJSON());
  }

  async delete(id) {
    const row = await TournamentModel.findByPk(id);
    if (!row) return false;

    await row.destroy();
    return true;
  }

  async getTournamentsToUpdate() {
    try {
      // Note: 'now' n'est pas utilisé ici mais pourrait servir pour les dates
      const tournaments = await TournamentModel.findAll({
        where: {
          status: ["scheduled", "live"],
        },
      });
      return tournaments;
    } catch (err) {
      console.error("Erreur service.getTournamentsToUpdate:", err);
      throw err;
    }
  }

  async updateStatus(id, newStatus) {
    const valid = ["scheduled", "live", "completed"];
    if (!valid.includes(newStatus)) throw new Error("Statut invalide");

    const tournament = await TournamentModel.findByPk(id);
    if (!tournament) return null;

    tournament.status = newStatus;
    await tournament.save();
    return tournament;
  }

  async getMatchesByTournamentId(tournamentId) {
    const rows = await MatchModel.findAll({
      where: { tournamentId },
      include: [
        { model: TeamModel, as: "homeTeam" },
        { model: TeamModel, as: "awayTeam" },
      ],
      order: [["date", "ASC"]],
    });

    return rows.map((row) => row.toJSON());
  }

  // Vérifie et ferme le tournoi automatiquement
  async checkAutoCompletion(tournamentId) {
    if (!tournamentId) return false;

    console.log(`[DEBUG] Vérification clôture tournoi ID: ${tournamentId}`);

    // On compte le nombre TOTAL de matchs dans ce tournoi
    const totalMatches = await MatchModel.count({
      where: { tournamentId },
    });

    // S'il n'y a pas de match, on ne fait rien
    if (totalMatches === 0) return false;

    // On compte le nombre de matchs completed ou cancelled
    const finishedMatches = await MatchModel.count({
      where: {
        tournamentId,
        status: ["completed", "cancelled"],
      },
    });

    console.log(`[DEBUG] Total: ${totalMatches} | Finis: ${finishedMatches}`);

    //  totalMatches = finishedMatches le tournoi terminé
    if (totalMatches === finishedMatches) {
      console.log("[DEBUG] Tous les matchs sont finis -> Clôture du tournoi.");
      const tournament = await TournamentModel.findByPk(tournamentId);

      // On ne met à jour que si le statut n'est pas déjà "completed"
      if (tournament && tournament.status !== "completed") {
        console.log(`Auto-clôture du tournoi ID ${tournamentId}`);

        await tournament.update({
          status: "completed",
          endDate: new Date(),
        });
        return true; // Indique qu'on a fermé le tournoi
      }
      console.log("⚠️ [DEBUG] Le tournoi était DÉJÀ completed ou introuvable.");
    }

    // Si on est ici, c'est que le tournoi doit rester "live" (s'il a commencé)
    // On pourrait forcer le statut "live" si des matchs ont commencé, etc.
    return false;
  }
}

export default TournamentService;
