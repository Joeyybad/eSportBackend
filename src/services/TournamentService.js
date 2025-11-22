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
      const now = new Date();
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
        {
          model: TeamModel,
          as: "homeTeam",
        },
        {
          model: TeamModel,
          as: "awayTeam",
        },
      ],
      order: [["date", "ASC"]],
    });

    return rows.map((row) => row.toJSON());
  }
}

export default TournamentService;
