import { Team as TeamModel } from "../models/index.js";

class TeamRepository {
  async findAll(options = {}) {
    return await TeamModel.findAll(options);
  }

  async findAndCountAll(options = {}) {
    return await TeamModel.findAndCountAll(options);
  }

  async findById(id) {
    return await TeamModel.findByPk(id);
  }

  async create(data) {
    return await TeamModel.create(data);
  }

  async update(id, data) {
    const team = await this.findById(id);
    if (!team) return null;
    return await team.update(data);
  }

  async delete(id) {
    const team = await this.findById(id);

    if (!team) return false;

    await team.update({ deleted_at: new Date() });

    return true;
  }
}

export default TeamRepository;
