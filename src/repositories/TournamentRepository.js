import { Tournament as TournamentModel } from "../models/index.js";

class TournamentRepository {
  async findAll() {
    return await TournamentModel.findAll({
      order: [["startDate", "ASC"]],
    });
  }

  async findById(id) {
    return await TournamentModel.findByPk(id);
  }

  // Spécial pour le CronJob (getTournamentsToUpdate)
  async findByStatus(statuses) {
    return await TournamentModel.findAll({
      where: {
        status: statuses,
      },
    });
  }

  async create(data) {
    return await TournamentModel.create(data);
  }

  // update standard
  async update(tournamentInstance, data) {
    return await tournamentInstance.update(data);
  }

  async delete(id) {
    const tournament = await this.findById(id);
    if (!tournament) return false;
    await tournament.destroy();
    return true;
  }
}

export default TournamentRepository;
