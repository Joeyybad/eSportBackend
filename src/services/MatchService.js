import { Match as MatchModel, Team, Tournament } from "../models/index.js";
import Match from "../domain/Match.js";

class MatchService {
  async getAll() {
    const rows = await MatchModel.findAll({
      include: [Team, Tournament],
      order: [["date", "ASC"]],
    });

    return rows.map((row) => new Match(row.toJSON()));
  }

  async getById(id) {
    const row = await MatchModel.findByPk(id, {
      include: [Team, Tournament],
    });

    if (!row) return null;

    return new Match(row.toJSON());
  }

  async create(data) {
    const row = await MatchModel.create(data);
    return new Match(row.toJSON());
  }

  async update(id, data) {
    const row = await MatchModel.findByPk(id);
    if (!row) return null;

    await row.update(data);
    return new Match(row.toJSON());
  }

  async delete(id) {
    const row = await MatchModel.findByPk(id);
    if (!row) return false;

    await row.destroy();
    return true;
  }
  async updateStatus(id, newStatus) {
    const valid = ["scheduled", "live", "completed", "cancelled"];
    if (!valid.includes(newStatus)) throw new Error("Statut invalide");

    return this.update(id, { status: newStatus });
  }
}

export default new MatchService();
