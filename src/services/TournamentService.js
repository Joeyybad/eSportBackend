import Tournament from "../domain/Tournament.js";

class TournamentService {
  // Injection des repositories
  constructor(tournamentRepository, matchRepository) {
    this.tournamentRepository = tournamentRepository;
    this.matchRepository = matchRepository;
  }

  async getAll() {
    const rows = await this.tournamentRepository.findAll();
    return rows.map((row) => new Tournament(row.toJSON()));
  }

  async getById(id) {
    const row = await this.tournamentRepository.findById(id);
    return row ? new Tournament(row.toJSON()) : null;
  }

  async create(data) {
    const row = await this.tournamentRepository.create(data);
    return new Tournament(row.toJSON());
  }

  async update(id, data) {
    const row = await this.tournamentRepository.findById(id);
    if (!row) return null;

    await this.tournamentRepository.update(row, data);
    return new Tournament(row.toJSON());
  }

  async delete(id) {
    return await this.tournamentRepository.delete(id);
  }

  // Utilisé par le CronJob
  async getTournamentsToUpdate() {
    try {
      const rows = await this.tournamentRepository.findByStatus([
        "scheduled",
        "live",
      ]);
      // On retourne les instances brutes pour le job, ou des objets domaine, au choix.
      // Pour le Job, l'instance brute est souvent pratique pour avoir accès à .save() si besoin,
      // mais ici on reste propre avec des objets domaine si possible.
      return rows.map((r) => new Tournament(r.toJSON()));
    } catch (err) {
      console.error("Erreur service.getTournamentsToUpdate:", err);
      throw err;
    }
  }

  async updateStatus(id, newStatus) {
    const valid = ["scheduled", "live", "completed"];
    if (!valid.includes(newStatus)) throw new Error("Statut invalide");

    const tournament = await this.tournamentRepository.findById(id);
    if (!tournament) return null;

    await this.tournamentRepository.update(tournament, { status: newStatus });
    return new Tournament(tournament.toJSON());
  }

  // Utilise le MatchRepository pour récupérer les matchs avec les équipes
  async getMatchesByTournamentId(tournamentId) {
    // Le MatchRepository a déjà une méthode findAll qui inclut les Teams (via _getIncludes)
    const rows = await this.matchRepository.findAll({
      where: { tournamentId },
    });

    return rows.map((row) => row.toJSON());
  }

  // Utilise le MatchRepository pour compter
  async checkAutoCompletion(tournamentId) {
    if (!tournamentId) return false;

    console.log(`[DEBUG] Vérification clôture tournoi ID: ${tournamentId}`);

    // 1. Compter TOTAL via MatchRepo
    const totalMatches = await this.matchRepository.count({
      where: { tournamentId },
    });

    if (totalMatches === 0) return false;

    // 2. Compter FINIS via MatchRepo
    const finishedMatches = await this.matchRepository.count({
      where: {
        tournamentId,
        status: ["completed", "cancelled"],
      },
    });

    console.log(`[DEBUG] Total: ${totalMatches} | Finis: ${finishedMatches}`);

    if (totalMatches === finishedMatches) {
      console.log("[DEBUG] Tous les matchs sont finis -> Clôture du tournoi.");
      const tournament = await this.tournamentRepository.findById(tournamentId);

      if (tournament && tournament.status !== "completed") {
        console.log(`Auto-clôture du tournoi ID ${tournamentId}`);

        await this.tournamentRepository.update(tournament, {
          status: "completed",
          endDate: new Date(),
        });
        return true;
      }
      console.log(" [DEBUG] Le tournoi était DÉJÀ completed ou introuvable.");
    }

    return false;
  }
}

export default TournamentService;
