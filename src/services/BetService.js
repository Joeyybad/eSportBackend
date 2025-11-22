import {
  Bet as BetModel,
  User as UserModel,
  Match as MatchModel,
  Team as TeamModel,
} from "../models/index.js";
import Bet from "../domain/Bet.js";

class BetService {
  async create(data) {
    const match = await MatchModel.findByPk(data.matchId);
    if (!match) {
      const error = new Error("Match introuvable");
      error.status = 404;
      throw error;
    }

    let odds = null;
    if (data.prediction === "home") odds = match.oddsHome;
    else if (data.prediction === "away") odds = match.oddsAway;
    else if (data.prediction === "draw") odds = match.oddsDraw;
    try {
      const row = await BetModel.create({
        ...data,
        odds,
        status: "pending",
      });
      await UserModel.increment("betsTotal", { where: { id: data.userId } });
      return new Bet(row.toJSON());
    } catch (dbError) {
      console.error("ERREUR CRÉATION PARI DB (Sequelize):", dbError.message);
      // Souvent, Sequelize encapsule les erreurs de validation
      console.error("ERREUR DÉTAILLÉE :", dbError);

      // Relancer l'erreur pour que le contrôleur la renvoie au client
      throw dbError;
    }
  }

  async getByUser(userId) {
    const rows = await BetModel.findAll({
      where: { userId },
      include: [
        {
          model: MatchModel,

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
        },

        {
          model: UserModel,
          as: "user",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return rows.map((row) => row.toJSON());
  }
}
export default BetService;
