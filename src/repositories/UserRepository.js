import { User } from "../models/index.js";

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async findById(id, options = {}) {
    return await User.findByPk(id, options);
  }

  async findAll() {
    return await User.findAll({ order: [["createdAt", "DESC"]] });
  }

  async create(data) {
    return await User.create(data);
  }

  async update(userInstance, data, options = {}) {
    return await userInstance.update(data, options);
  }

  async delete(id) {
    const user = await this.findById(id);
    if (!user) return false;
    await user.destroy();
    return true;
  }

  /**
   * Permet d'ajouter une valeur à une colonne numérique (stats, gains)
   * sans avoir besoin de lire l'utilisateur avant.
   * @param {number} userId - L'ID du joueur
   * @param {string} field - Le nom de la colonne ('betsTotal', 'totalEarnings'...)
   * @param {object} options - Pour passer une transaction { transaction: t }
   */
  async incrementStat(userId, field, options = {}) {
    // La méthode .increment de Sequelize génère un :
    // UPDATE users SET field = field + 1 WHERE id = userId
    return await User.increment(field, {
      where: { id: userId },
      ...options,
    });
  }
}

export default UserRepository;
