class BetController {
  constructor(betService) {
    this.service = betService;
  }
  // regroupe les paris par user
  getUserBets = async (req, res) => {
    try {
      const bets = await this.service.getByUser(req.user.id);
      res.json(bets);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  //Crée un paris
  create = async (req, res) => {
    try {
      console.log("Token Payload (req.user):", req.user);
      const userId = req.user?.id;

      if (!userId) {
        return res
          .status(401)
          .json({ message: "Utilisateur non authentifié (ID manquant)." });
      }
      const bet = await this.service.create({
        ...req.body,
        userId: userId,
      });
      res.status(201).json(bet);
    } catch (err) {
      console.error("Erreur Contrôleur Pari:", err.message);
      if (err.status === 404) {
        return res.status(404).json({ message: err.message });
      }
      return res.status(400).json({
        message:
          err.message ||
          "Erreur lors de l'insertion du pari en base de données.",
      });
    }
  };
}

export default BetController;
