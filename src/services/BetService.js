// @ts-check
import Bet from "../domain/Bet.js";

// 1. IMPORTATION DES TYPES DES REPOSITORIES
/** @typedef {import('../repositories/BetRepository').default} BetRepository */
/** @typedef {import('../repositories/MatchRepository').default} MatchRepository */
/** @typedef {import('../repositories/UserRepository').default} UserRepository */

/**
 * Définition de la structure d'un Match
 * @typedef {Object} MatchDTO
 * @property {string} status - ex: 'scheduled', 'completed'
 * @property {number} oddsHome
 * @property {number} oddsAway
 * @property {number} oddsDraw
 */

/**
 * Définition de la structure des données attendues pour créer un pari
 * @typedef {Object} CreateBetDTO
 * @property {number} userId - L'ID de l'utilisateur qui parie
 * @property {number} matchId - L'ID du match concerné
 * @property {number} amount - Le montant de la mise
 * @property {'home'|'away'|'draw'} prediction - Le pronostic
 */

class BetService {
  /**
   * Injection des dépendances (Repositories)
   * @param {BetRepository} betRepository
   * @param {MatchRepository} matchRepository
   * @param {UserRepository} userRepository
   */
  constructor(betRepository, matchRepository, userRepository) {
    this.betRepository = betRepository;
    this.matchRepository = matchRepository;
    this.userRepository = userRepository;
  }

  /**
   * Crée un nouveau pari après validations métier.
   * @param {CreateBetDTO} data
   * @returns {Promise<Bet>}
   */
  async create(data) {
    // 1. VÉRIFICATION ANTI-DOUBLON
    const existingBet = await this.betRepository.findExisting(
      data.userId,
      data.matchId
    );

    if (existingBet) {
      const error = new Error("Vous avez déjà parié sur ce match !");
      // @ts-ignore
      error.status = 409;
      throw error;
    }

    // 2. VÉRIFICATION DU MATCH
    // On dit à VS Code : "Considère que le résultat est de type MatchDTO"
    /** @type {MatchDTO} */
    // @ts-ignore (On ignore le fait que findById puisse renvoyer null pour simplifier le typage ici)
    const match = await this.matchRepository.findById(data.matchId);

    if (!match) {
      const error = new Error("Match introuvable");
      // @ts-ignore
      error.status = 404;
      throw error;
    }

    // SÉCURITÉ : Statut
    if (match.status !== "scheduled") {
      const error = new Error("Les paris sont fermés pour ce match.");
      // @ts-ignore
      error.status = 400;
      throw error;
    }

    // 3. RÉCUPÉRATION DES COTES
    let odds = null;

    if (data.prediction === "home") odds = match.oddsHome;
    else if (data.prediction === "away") odds = match.oddsAway;
    else if (data.prediction === "draw") odds = match.oddsDraw;

    if (!odds || odds <= 1) {
      const error = new Error(
        "Ce type de pari est indisponible pour ce match."
      );
      // @ts-ignore
      error.status = 400;
      throw error;
    }

    // 4. CALCUL DU GAIN
    const calculatedGain = parseFloat((data.amount * odds).toFixed(2));

    try {
      // 5. CRÉATION
      const row = await this.betRepository.create({
        userId: data.userId,
        matchId: data.matchId,
        amount: data.amount,
        prediction: data.prediction,
        odds: odds,
        potentialGain: calculatedGain,
        status: "pending",
      });

      // 6. INCRÉMENTATION STATS
      await this.userRepository.incrementStat(data.userId, "betsTotal");

      // @ts-ignore
      return new Bet(row.toJSON());
    } catch (err) {
      const dbError = /** @type {Error} */ (err);
      console.error("ERREUR SERVICE PARI:", dbError.message);
      throw dbError;
    }
  }

  /**
   * Récupère tous les paris d'un utilisateur
   * @param {number} userId
   * @returns {Promise<Array<Bet>>}
   */
  async getByUser(userId) {
    const rows = await this.betRepository.findByUser(userId);
    return rows.map((/** @type {any} */ row) => new Bet(row.toJSON()));
  }
}

export default BetService;
