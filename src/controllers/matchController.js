class MatchController {
  constructor(matchService) {
    this.service = matchService;
  }
  //Récupère tous les matchs
  getAllMatches = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;

      const result = await this.service.getAllMatches(page, limit);

      res.json(result);
    } catch (err) {
      next(err);
    }
  };
  // Récupère les match par Id
  getMatchById = async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!id) return res.status(400).json({ message: "ID manquant." });
      const match = await this.service.getMatchById(id);
      if (!match) return res.status(404).json({ message: "Match introuvable" });

      res.json(match);
    } catch (err) {
      next(err);
    }
  };
  // Crée un match
  create = async (req, res, next) => {
    try {
      const match = await this.service.createMatch(req.body);
      res.status(201).json(match);
    } catch (err) {
      next(err);
    }
  };
  //Met à jour un match
  update = async (req, res, next) => {
    try {
      const match = await this.service.update(req.params.id, req.body);
      if (!match) return res.status(404).json({ message: "Match introuvable" });

      res.json(match);
    } catch (err) {
      next(err);
    }
  };
  //Met à jour le résultat d'un match
  updateMatchResult = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { result } = req.body; // ("home" | "away" | "draw")

      const updatedMatch = await this.service.updateResult(id, result);

      res.json({
        message: "Résultat mis à jour et gains calculés.",
        match: updatedMatch,
      });
    } catch (err) {
      next(err);
    }
  };
  // Suppression d'un match
  delete = async (req, res, next) => {
    try {
      const success = await this.service.delete(req.params.id);
      if (!success)
        return res.status(404).json({ message: "Match introuvable" });

      res.json({ message: "Match supprimé" });
    } catch (err) {
      next(err);
    }
  };
}
export default MatchController;
