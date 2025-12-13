import {
  Bet as BetModel,
  User as UserModel,
  Match as MatchModel,
  Team as TeamModel,
} from "../models/index.js";
import Bet from "../domain/Bet.js";

class BetService {
  async create(data) {
    // 1. VÉRIFICATION ANTI-DOUBLON
    // CORRECTION ICI : On utilise BetModel, pas Bet !
    const existingBet = await BetModel.findOne({
      where: {
        userId: data.userId,
        matchId: data.matchId,
      },
    });

    if (existingBet) {
      throw new Error("Vous avez déjà parié sur ce match !");
    }

    // 2. VÉRIFICATION DU MATCH
    const match = await MatchModel.findByPk(data.matchId);
    if (!match) {
      const error = new Error("Match introuvable");
      error.status = 404;
      throw error;
    }

    // AJOUT SÉCURITÉ : On ne parie pas sur un match fini ou en cours
    if (match.status !== "scheduled") {
      throw new Error("Les paris sont fermés pour ce match.");
    }

    // 3. RÉCUPÉRATION DES COTES
    let odds = null;
    if (data.prediction === "home") odds = match.oddsHome;
    else if (data.prediction === "away") odds = match.oddsAway;
    else if (data.prediction === "draw") odds = match.oddsDraw;

    if (!odds) {
      throw new Error("Prédiction invalide ou cote introuvable.");
    }

    // 4. CALCUL DU GAIN (SÉCURITÉ)
    // On ne fait pas confiance au 'data.potentialGain' envoyé par le front (qui peut être falsifié)
    // On le calcule nous-même : Montant * Cote
    const calculatedGain = parseFloat((data.amount * odds).toFixed(2));

    try {
      const row = await BetModel.create({
        userId: data.userId,
        matchId: data.matchId,
        amount: data.amount,
        prediction: data.prediction,
        odds: odds,
        potentialGain: calculatedGain, // On utilise notre calcul sécurisé
        status: "pending",
      });

      await UserModel.increment("betsTotal", { where: { id: data.userId } });

      return new Bet(row.toJSON());
    } catch (dbError) {
      console.error("ERREUR CRÉATION PARI DB (Sequelize):", dbError.message);
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
