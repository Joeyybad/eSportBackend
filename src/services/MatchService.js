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

    const transaction = await this.matchRepository.startTransaction();

    // 🚩 1. On crée un indicateur de sécurité
    let transactionFinished = false;

    try {
      const match = await this.matchRepository.findById(id, { transaction });

      if (!match) throw new Error("Match introuvable");

      if (match.result !== null) {
        // On doit rollback ici car on n'a pas encore commit
        await transaction.rollback();
        transactionFinished = true; // On marque comme fini
        throw new Error("Résultat déjà validé.");
      }

      // Mise à jour du match
      await this.matchRepository.update(
        match,
        {
          status: "completed",
          result: result,
        },
        { transaction }
      );

      // Gestion des Paris (paiement des gagnants)
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

      // ✅ 2. On valide la transaction
      await transaction.commit();
      transactionFinished = true; // 🚩 C'est fini, on ne touche plus à la transaction

      // 3. Gestion du Tournoi (C'est souvent ici que ça plante si le service est mal injecté)
      // Si ça plante ici, le match restera validé (car commit est passé), ce qui est mieux que de tout casser.
      if (match.tournamentId && this.tournamentService) {
        try {
          await this.tournamentService.checkAutoCompletion(match.tournamentId);
        } catch (tournamentError) {
          console.error(
            "Erreur mise à jour tournoi (non bloquant) :",
            tournamentError
          );
        }
      }

      return new Match(match.toJSON());
    } catch (error) {
      // 🚩 4. On rollback SEULEMENT si la transaction n'est pas déjà finie
      if (!transactionFinished) {
        await transaction.rollback();
      }
      throw error;
    }
  }
  // Création
  async createMatch(data) {
    // (Ta logique de création ici, simplifiée pour l'exemple)
    const row = await this.matchRepository.create(data);
    return new Match(row.toJSON());
  }

  // Mise à jour
  async update(id, data) {
    const match = await this.matchRepository.findById(id);

    if (!match) {
      throw new Error("Match introuvable");
    }
    await this.matchRepository.update(match, data);

    return new Match(match.toJSON());
  }

  async delete(id) {
    return await this.matchRepository.delete(id);
  }
}

export default MatchService;
