import Team from "../domain/Team.js";

class TeamService {
  // On injecte le repository dans le constructeur
  constructor(teamRepository) {
    this.teamRepository = teamRepository;
  }

  async getAll(page = 1, limit = 6) {
    const offset = (page - 1) * limit;

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

  async update(id, data, file) {
    // 1. On cherche l'équipe (C'est ici qu'on utilise l'ID)
    const team = await this.teamRepository.findById(id);

    if (!team) return null; // Ou throw new Error("Equipe introuvable")

    // 2. Gestion de l'image (si un fichier est envoyé)
    if (file) {
      data.logo = file.filename; // On met à jour le champ logo
    }

    // 3. On envoie l'INSTANCE (team) au repository, pas l'ID
    const updatedTeam = await this.teamRepository.update(team, data);

    return new Team(updatedTeam.toJSON());
  }

  async delete(id) {
    return await this.teamRepository.delete(id);
  }
}
export default TeamService;
