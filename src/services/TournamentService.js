import { Tournament as TournamentModel } from "../models/index.js";
import Tournament from "../domain/Tournament.js";

export default class TournamentService {
  async getAll() {
    const rows = await TournamentModel.findAll();
    return rows.map((row) => new Tournament(row.toJSON()));
  }

  async getById(id) {
    const row = await TournamentModel.findByPk(id);
    return row ? new Tournament(row.toJSON()) : null;
  }

  async create(data) {
    const row = await TournamentModel.create(data);
    return new Tournament(row.toJSON());
  }

  async update(id, data) {
    const row = await TournamentModel.findByPk(id);
    if (!row) return null;

    await row.update(data);
    return new Tournament(row.toJSON());
  }

  async delete(id) {
    const row = await TournamentModel.findByPk(id);
    if (!row) return false;

    await row.destroy();
    return true;
  }
}
