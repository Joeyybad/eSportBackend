import { Bet as BetModel, Match, Team, User } from "../models/index.js";

class BetRepository {
  _getDeepIncludes() {
    return [
      {
        model: Match,
        include: [
          { model: Team, as: "homeTeam" },
          { model: Team, as: "awayTeam" },
        ],
      },
      {
        model: User,
        as: "user",
      },
    ];
  }

  // Vérifier doublon
  async findExisting(userId, matchId) {
    return await BetModel.findOne({
      where: { userId, matchId },
    });
  }

  async create(data, options = {}) {
    return await BetModel.create(data, options);
  }

  // Historique des paris d'un utilisateur
  async findByUser(userId) {
    return await BetModel.findAll({
      where: { userId },
      include: this._getDeepIncludes(),
      order: [["createdAt", "DESC"]],
    });
  }

  // Pour le calcul des gains (utilisé dans MatchService)
  async findByMatch(matchId, options = {}) {
    return await BetModel.findAll({
      where: { matchId },
      ...options,
    });
  }

  async update(betInstance, data, options = {}) {
    return await betInstance.update(data, options);
  }
}

export default BetRepository;
