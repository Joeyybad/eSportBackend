import {
  Match as MatchModel,
  Team as TeamModel,
  Tournament as TournamentModel,
  Bet,
  User,
} from "../models/index.js";
import Match from "../domain/Match.js";
import { Op } from "sequelize";

class MatchService {
  async getAllMatches() {
    const rows = await MatchModel.findAll({
      include: [
        {
          model: TeamModel,
          as: "homeTeam",
        },
        {
          model: TeamModel,
          as: "awayTeam",
        },
        {
          model: TournamentModel,
          as: "tournament",
        },
      ],
      order: [["date", "DESC"]],
    });

    return rows.map((row) => new Match(row.toJSON()));
  }

  async getMatchById(id) {
    const row = await MatchModel.findByPk(id, {
      include: [
        {
          model: TeamModel,
          as: "homeTeam",
        },
        {
          model: TeamModel,
          as: "awayTeam",
        },
        {
          model: TournamentModel,
          as: "tournament",
        },
      ],
    });

    if (!row) return null;

    return new Match(row.toJSON());
  }

  async create(data) {
    const row = await MatchModel.create(data);
    return new Match(row.toJSON());
  }

  async update(id, data) {
    const row = await MatchModel.findByPk(id);
    if (!row) return null;

    await row.update(data);
    return new Match(row.toJSON());
  }

  async delete(id) {
    const row = await MatchModel.findByPk(id);
    if (!row) return false;

    await row.destroy();
    return true;
  }
  async updateStatus(id, newStatus) {
    const valid = ["scheduled", "live", "completed", "cancelled"];
    if (!valid.includes(newStatus)) throw new Error("Statut invalide");

    return this.update(id, { status: newStatus });
  }
  async updateResult(id, result) {
    const match = await MatchModel.findByPk(id);
    if (!match) {
      throw new Error("Match introuvable");
    }

    const validResults = ["home", "away", "draw"];
    if (!validResults.includes(result)) {
      throw new Error("Résultat invalide");
    }

    match.status = "completed";
    match.result = result;
    await match.save();

    // (Important) Résolution des paris
    const bets = await Bet.findAll({ where: { matchId: match.id } });

    for (const bet of bets) {
      const user = await User.findByPk(bet.userId);

      let status;
      let gain = 0;

      if (bet.prediction === result) {
        status = "won";
        gain = bet.amount * bet.odds;

        // Mise des stat et gains
        await user.update({
          betsWon: (user.betsWon || 0) + 1,
          totalEarnings: (user.totalEarnings || 0) + gain,
        });
      } else {
        status = "lost";
      }

      await bet.update({ status, gain });
    }

    return match;
  }
  // mise a jour job match
  async getMatchesToUpdate() {
    try {
      const rows = await MatchModel.findAll({
        where: {
          status: {
            [Op.in]: ["scheduled", "live"],
          },
        },
      });
      return rows.map((row) => new Match(row.toJSON()));
    } catch (err) {
      console.error("Erreur service.getMatchesToUpdate:", err);
      throw err;
    }
  }
}

export default MatchService;
