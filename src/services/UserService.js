import { User as UserModel } from "../models/index.js";
import User from "../domain/User.js";

class UserService {
  async getById(id) {
    const row = await UserModel.findByPk(id);
    return row ? new User(row.toJSON()) : null;
  }

  async getByEmail(email) {
    const row = await UserModel.findOne({ where: { email } });
    return row ? new User(row.toJSON()) : null;
  }

  async create(data) {
    const row = await UserModel.create(data);
    return new User(row.toJSON());
  }

  async update(id, data) {
    const row = await UserModel.findByPk(id);
    if (!row) return null;

    await row.update(data);
    return new User(row.toJSON());
  }
}
export default new UserService();
