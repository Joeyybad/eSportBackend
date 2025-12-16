import { Match as MatchModel, Team, Tournament } from "../models/index.js";

class MatchRepository {
  // Factorisation des includes pour le réutiliser
  _getIncludes() {
    return [
      { model: Team, as: "homeTeam" },
      { model: Team, as: "awayTeam" },
      { model: Tournament, as: "tournament" },
    ];
  }

  // Permet de démarrer une transaction depuis le Service
  async startTransaction() {
    return await MatchModel.sequelize.transaction();
  }

  // Récupérer un match par ID (avec options pour la transaction)
  async findById(id, options = {}) {
    return await MatchModel.findByPk(id, {
      ...options,
      include: this._getIncludes(),
    });
  }

  // Pagination et récupération complète
  async findAndCountAll(options = {}) {
    return await MatchModel.findAndCountAll({
      ...options,
      include: this._getIncludes(),
      distinct: true, // Important pour que le count soit juste avec les includes
      order: [["date", "DESC"]],
    });
  }

  // Récupérer une liste simple (pour les Jobs ou filtres spécifiques)
  async findAll(options = {}) {
    return await MatchModel.findAll({
      ...options,
      include: this._getIncludes(),
      order: [["date", "ASC"]],
    });
  }

  // Compter les matchs (utilisé par checkAutoCompletion du tournoi)
  async count(options = {}) {
    return await MatchModel.count(options);
  }

  async create(data) {
    return await MatchModel.create(data);
  }

  // Mise à jour (accepte aussi une transaction dans options)
  async update(matchInstance, data, options = {}) {
    return await matchInstance.update(data, options);
  }

  async save(matchInstance, options = {}) {
    return await matchInstance.save(options);
  }

  async delete(id) {
    const match = await this.findById(id);
    if (!match) return false;
    await match.destroy(); // Soft delete géré par le modèle
    return true;
  }
}

export default MatchRepository;
