import { Team as TeamModel } from "../models/index.js";
import Team from "../domain/Team.js";

class TeamService {
  async getAll() {
    const rows = await TeamModel.findAll();
    return rows.map((row) => new Team(row.toJSON()));
  }

  async getById(id) {
    const row = await TeamModel.findByPk(id);
    return row ? new Team(row.toJSON()) : null;
  }

  async create(data) {
    const row = await TeamModel.create(data);
    return new Team(row.toJSON());
  }

  async update(id, data) {
    const row = await TeamModel.findByPk(id);
    if (!row) return null;

    await row.update(data);
    return new Team(row.toJSON());
  }

  async delete(id) {
    const row = await TeamModel.findByPk(id);
    if (!row) return false;

    await row.destroy();
    return true;
  }
}
export default TeamService;
