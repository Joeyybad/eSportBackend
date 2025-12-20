class TournamentController {
  constructor(tournamentService) {
    this.service = tournamentService;
  }

  getAll = async (req, res) => {
    try {
      const tournaments = await this.service.getAll();
      res.json(tournaments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  getById = async (req, res) => {
    try {
      const tournament = await this.service.getById(req.params.id);
      if (!tournament)
        return res.status(404).json({ message: "Tournoi introuvable" });
      res.json(tournament);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  create = async (req, res) => {
    try {
      const tournament = await this.service.create(req.body);
      res.status(201).json(tournament);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  update = async (req, res) => {
    try {
      const tournament = await this.service.update(req.params.id, req.body);
      if (!tournament)
        return res.status(404).json({ message: "Tournoi introuvable" });
      res.json(tournament);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  delete = async (req, res) => {
    try {
      const success = await this.service.delete(req.params.id);
      if (!success)
        return res.status(404).json({ message: "Tournoi introuvable" });
      res.json({ message: "Tournoi supprimé" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  getMatches = async (req, res) => {
    try {
      const { id } = req.params;
      const matches = await this.service.getMatchesByTournamentId(id);
      res.status(200).json(matches);
    } catch (err) {
      console.error("Erreur contrôleur getMatches :", err);
      res.status(500).json({
        message: "Erreur lors de la récupération des matchs du tournoi.",
      });
    }
  };
}
export default TournamentController;
