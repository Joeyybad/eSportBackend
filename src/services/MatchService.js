import Match from "../domain/Match.js";
import { Bet, User } from "../models/index.js"; // On garde ça pour l'instant
import TournamentService from "./TournamentService.js";

class MatchService {
  // Injection du Repository ET du TournamentService (si besoin via DI ou instanciation interne)
  constructor(matchRepository) {
    this.matchRepository = matchRepository;
    this.tournamentService = new TournamentService(); // Idéalement injecté aussi, mais ok ici
  }

  async getAllMatches(page = 1, limit = 6) {
    const offset = (page - 1) * limit;

    const { count, rows } = await this.matchRepository.findAndCountAll({
      limit,
      offset,
    });

    return {
      matches: rows.map((row) => new Match(row.toJSON())),
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  async getMatchById(id) {
    const row = await this.matchRepository.findById(id);
    return row ? new Match(row.toJSON()) : null;
  }

  // Utilisé par le JOB CRON
  async getMatchesToUpdate() {
    const rows = await this.matchRepository.findAll({
      where: {
        status: ["scheduled", "live"], // Sequelize comprend le tableau comme un "OR"
      },
    });
    return rows.map((row) => new Match(row.toJSON()));
  }

  async updateStatus(id, newStatus) {
    const match = await this.matchRepository.findById(id);
    if (!match) return null;
    await this.matchRepository.update(match, { status: newStatus });
    return new Match(match.toJSON());
  }

  // --- LA GROSSE FONCTION UPDATE RESULT (ADAPTÉE REPO) ---
  async updateResult(id, result) {
    const validResults = ["home", "away", "draw"];
    if (!validResults.includes(result)) throw new Error("Résultat invalide");

    // 1. On lance la transaction VIA LE REPO
    const transaction = await this.matchRepository.startTransaction();

    try {
      // On passe { transaction } au repo
      const match = await this.matchRepository.findById(id, { transaction });

      if (!match) throw new Error("Match introuvable");

      // Sécurité anti-doublon
      if (match.result !== null) {
        await transaction.rollback();
        throw new Error("Résultat déjà validé.");
      }

      // 2. Mise à jour via le repo
      // Note: match.result = result ne sauvegarde pas, il faut appeler save ou update
      await this.matchRepository.update(
        match,
        {
          status: "completed",
          result: result,
        },
        { transaction }
      );

      // 3. Gestion des Paris (Code inchangé pour l'instant)
      const bets = await Bet.findAll({
        where: { matchId: match.id },
        transaction,
      });

      for (const bet of bets) {
        const user = await User.findByPk(bet.userId, { transaction });
        let status = "lost";
        let gain = 0;

        if (bet.prediction === result) {
          status = "won";
          gain = parseFloat(bet.amount) * parseFloat(bet.odds);
          if (user) {
            await user.update(
              {
                betsWon: (user.betsWon || 0) + 1,
                totalEarnings: (user.totalEarnings || 0) + gain,
              },
              { transaction }
            );
          }
        }
        await bet.update({ status, gain }, { transaction });
      }

      // 4. Validation
      await transaction.commit();

      // 5. Tournoi
      if (match.tournamentId) {
        await this.tournamentService.checkAutoCompletion(match.tournamentId);
      }

      return new Match(match.toJSON());
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Création
  async createMatch(data) {
    // (Ta logique de création ici, simplifiée pour l'exemple)
    const row = await this.matchRepository.create(data);
    return new Match(row.toJSON());
  }

  async deleteMatch(id) {
    return await this.matchRepository.delete(id);
  }
}

export default MatchService;
