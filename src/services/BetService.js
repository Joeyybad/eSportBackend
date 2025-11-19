import { Bet as BetModel, Match as MatchModel } from "../models/index.js";
import Bet from "../domain/Bet.js";

class BetService {
  async create(data) {
    const match = await MatchModel.findByPk(data.matchId);
    if (!match) throw new Error("Match introuvable");

    // Sélection automatique des odds
    let odds = null;
    if (data.prediction === "home") odds = match.oddsHome;
    else if (data.prediction === "away") odds = match.oddsAway;
    else if (data.prediction === "draw") odds = match.oddsDraw;

    const row = await BetModel.create({
      ...data,
      odds,
      status: "pending",
    });

    return new Bet(row.toJSON());
  }

  async getByUser(userId) {
    const rows = await BetModel.findAll({
      where: { userId },
      include: [MatchModel],
    });

    return rows.map((r) => new Bet({ ...r.toJSON(), match: r.match }));
  }

  async resolveBet(id, matchResult) {
    const row = await BetModel.findByPk(id);
    if (!row) return null;

    // let status = "lost";
    // if (row.prediction === matchResult) status = "won";

    // await row.update({ status });

    return new Bet(row.toJSON());
  }
}
export default new BetService();
