class MatchController {
  constructor(matchService) {
    this.service = matchService;
  }
  //Récupère tous les matchs
  getAllMatches = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;

      const result = await this.service.getAllMatches(page, limit);

      res.json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  // Récupère les match par Id
  getMatchById = async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) return res.status(400).json({ message: "ID manquant." });
      const match = await this.service.getMatchById(id);
      if (!match) return res.status(404).json({ message: "Match introuvable" });

      res.json(match);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  // Crée un match
  create = async (req, res) => {
    try {
      const match = await this.service.create(req.body);
      res.status(201).json(match);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  //Met à jour un match
  update = async (req, res) => {
    try {
      const match = await this.service.update(req.params.id, req.body);
      if (!match) return res.status(404).json({ message: "Match introuvable" });

      res.json(match);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  //Met à jour le résultat d'un match
  updateMatchResult = async (req, res) => {
    try {
      const { id } = req.params;
      const { result } = req.body; // ("home" | "away" | "draw")

      const updatedMatch = await this.service.updateResult(id, result);

      res.json({
        message: "Résultat mis à jour et gains calculés.",
        match: updatedMatch,
      });
    } catch (err) {
      const status = err.message.includes("introuvable") ? 404 : 400;
      res.status(status).json({ message: err.message });
    }
  };
  // Suppression d'un match
  delete = async (req, res) => {
    try {
      const success = await this.service.delete(req.params.id);
      if (!success)
        return res.status(404).json({ message: "Match introuvable" });

      res.json({ message: "Match supprimé" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}
export default MatchController;
