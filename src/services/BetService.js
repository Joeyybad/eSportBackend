import Bet from "../domain/Bet.js";

class BetService {
  // On injecte les 3 repos dont on a besoin
  constructor(betRepository, matchRepository, userRepository) {
    this.betRepository = betRepository;
    this.matchRepository = matchRepository;
    this.userRepository = userRepository;
  }

  async create(data) {
    // 1. VÉRIFICATION ANTI-DOUBLON (Via BetRepo)
    const existingBet = await this.betRepository.findExisting(
      data.userId,
      data.matchId
    );

    if (existingBet) {
      throw new Error("Vous avez déjà parié sur ce match !");
    }

    // 2. VÉRIFICATION DU MATCH (Via MatchRepo)
    const match = await this.matchRepository.findById(data.matchId);

    if (!match) {
      const error = new Error("Match introuvable");
      error.status = 404;
      throw error;
    }

    // SÉCURITÉ : Statut
    if (match.status !== "scheduled") {
      throw new Error("Les paris sont fermés pour ce match.");
    }

    // 3. RÉCUPÉRATION DES COTES (Logique métier)
    let odds = null;
    if (data.prediction === "home") odds = match.oddsHome;
    else if (data.prediction === "away") odds = match.oddsAway;
    else if (data.prediction === "draw") odds = match.oddsDraw;

    if (!odds) {
      throw new Error("Prédiction invalide ou cote introuvable.");
    }

    // 4. CALCUL DU GAIN
    const calculatedGain = parseFloat((data.amount * odds).toFixed(2));

    try {
      // 5. CRÉATION (Via BetRepo)
      const row = await this.betRepository.create({
        userId: data.userId,
        matchId: data.matchId,
        amount: data.amount,
        prediction: data.prediction,
        odds: odds,
        potentialGain: calculatedGain,
        status: "pending",
      });

      // 6. INCRÉMENTATION STATS (Via UserRepo)
      // On n'appelle plus UserModel directement
      await this.userRepository.incrementStat(data.userId, "betsTotal");

      // Note: Idéalement, on inclurait le match dans le retour,
      // mais pour une création rapide, renvoyer l'objet simple suffit souvent.
      return new Bet(row.toJSON());
    } catch (dbError) {
      console.error("ERREUR SERVICE PARI:", dbError.message);
      throw dbError;
    }
  }

  async getByUser(userId) {
    const rows = await this.betRepository.findByUser(userId);
    // On transforme chaque ligne brute (Sequelize) en objet Domaine (Bet)
    return rows.map((row) => new Bet(row.toJSON()));
  }
}

export default BetService;
