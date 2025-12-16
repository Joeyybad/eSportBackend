import { User } from "../models/index.js";

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async findById(id, options = {}) {
    return await User.findByPk(id, options);
  }

  async findAll() {
    return await User.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  // C'est ici que Sequelize prend le relais.
  // Quand on appelle User.create, le Hook 'beforeCreate' du modèle se déclenche.
  async create(data) {
    return await User.create(data);
  }

  async update(userInstance, data, options = {}) {
    // Si data contient un password, le Hook 'beforeUpdate' du modèle le hasheras.
    return await userInstance.update(data, options);
  }

  async delete(id) {
    const user = await this.findById(id);
    if (!user) return false;
    await user.destroy();
    return true;
  }
}

export default UserRepository;
