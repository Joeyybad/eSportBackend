import { Team as TeamModel } from "../models/index.js";

class TeamRepository {
  async findAll(options = {}) {
    return await TeamModel.findAll(options);
  }

  async findAndCountAll(options = {}) {
    const queryOptions = {
      ...options, // On garde la pagination (limit, offset)
      where: {
        ...options.where, // On garde les filtres existants (ex: recherche)
        deleted_at: null,
      },
    };
    return await TeamModel.findAndCountAll(queryOptions);
  }

  async findById(id) {
    return await TeamModel.findByPk(id);
  }

  async create(data) {
    return await TeamModel.create(data);
  }

  async update(teamInstance, data) {
    return await teamInstance.update(data);
  }

  async delete(id) {
    const team = await this.findById(id);

    if (!team) return false;

    await team.update({ deleted_at: new Date() });

    return true;
  }
}

export default TeamRepository;
