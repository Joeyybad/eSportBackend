// @ts-check
import { Bet as BetModel, Match, Team, User } from "../models/index.js";

/**
 * Définition des données nécessaires pour créer un pari
 * @typedef {Object} BetCreationData
 * @property {number} userId
 * @property {number} matchId
 * @property {number} amount
 * @property {'home'|'away'|'draw'} prediction
 * @property {number} odds
 * @property {number} potentialGain
 * @property {string} [status]
 */

class BetRepository {
  /**
   * Helper privé pour récupérer les relations (Match, Teams, User)
   * @returns {Array<Object>} Configuration des includes Sequelize
   */
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

  /**
   * Vérifie si un pari existe déjà pour ce couple user/match
   * @param {number} userId - ID de l'utilisateur
   * @param {number} matchId - ID du match
   * @returns {Promise<Object|null>} L'instance du pari ou null si inexistant
   */
  async findExisting(userId, matchId) {
    return await BetModel.findOne({
      where: { userId, matchId },
    });
  }

  /**
   * Crée un nouveau pari en base de données
   * @param {BetCreationData} data - Les données du pari
   * @param {Object} [options] - Options Sequelize (ex: transaction)
   * @returns {Promise<Object>} L'instance du pari créé
   */
  async create(data, options = {}) {
    return await BetModel.create(data, options);
  }

  /**
   * Récupère l'historique complet des paris d'un utilisateur
   * @param {number} userId
   * @returns {Promise<Array<Object>>} Liste des paris avec les associations
   */
  async findByUser(userId) {
    return await BetModel.findAll({
      where: { userId },
      include: this._getDeepIncludes(),
      order: [["createdAt", "DESC"]],
    });
  }

  /**
   * Récupère les paris liés à un match (pour le calcul des gains)
   * @param {number} matchId
   * @param {Object} [options]
   * @returns {Promise<Array<Object>>} Liste des paris
   */
  async findByMatch(matchId, options = {}) {
    return await BetModel.findAll({
      where: { matchId },
      ...options,
    });
  }

  /**
   * Met à jour une instance de pari existante
   * * Note : On utilise le type {any} pour betInstance car c'est un objet
   * complexe de Sequelize (DAO) qui contient des méthodes comme .update() ou .save()
   * * @param {any} betInstance - L'instance Sequelize récupérée
   * @param {Object} data - Les champs à modifier (ex: { status: 'won' })
   * @param {Object} [options]
   * @returns {Promise<Object>} L'instance mise à jour
   */
  async update(betInstance, data, options = {}) {
    return await betInstance.update(data, options);
  }
}

export default BetRepository;
