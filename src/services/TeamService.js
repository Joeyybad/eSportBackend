import Team from "../domain/Team.js";

class TeamService {
  // On injecte le repository dans le constructeur
  constructor(teamRepository) {
    this.teamRepository = teamRepository;
  }

  async getAll(page = 1, limit = 6) {
    const offset = (page - 1) * limit;

    // Appel au repository au lieu du Model
    const { count, rows } = await this.teamRepository.findAndCountAll({
      limit,
      offset,
      order: [["teamName", "ASC"]],
    });

    return {
      teams: rows.map((row) => new Team(row.toJSON())),
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  async create(data) {
    const row = await this.teamRepository.create(data);
    return new Team(row.toJSON());
  }

  async getById(id) {
    const row = await this.teamRepository.findById(id);
    return row ? new Team(row.toJSON()) : null;
  }

  async update(id, data) {
    const row = await this.teamRepository.findById(id);
    if (!row) return null;

    await this.teamRepository.update(row, data);
    return new Team(row.toJSON());
  }

  async delete(id) {
    return await this.teamRepository.delete(id);
  }
}
export default TeamService;
