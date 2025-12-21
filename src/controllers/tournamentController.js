class TournamentController {
  constructor(tournamentService) {
    this.service = tournamentService;
  }

  getAll = async (req, res, next) => {
    try {
      const tournaments = await this.service.getAll();
      res.json(tournaments);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const tournament = await this.service.getById(req.params.id);
      if (!tournament)
        return res.status(404).json({ message: "Tournoi introuvable" });
      res.json(tournament);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const tournament = await this.service.create(req.body);
      res.status(201).json(tournament);
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const tournament = await this.service.update(req.params.id, req.body);
      if (!tournament)
        return res.status(404).json({ message: "Tournoi introuvable" });
      res.json(tournament);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const success = await this.service.delete(req.params.id);
      if (!success)
        return res.status(404).json({ message: "Tournoi introuvable" });
      res.json({ message: "Tournoi supprimé" });
    } catch (err) {
      next(err);
    }
  };

  getMatches = async (req, res, next) => {
    try {
      const { id } = req.params;
      const matches = await this.service.getMatchesByTournamentId(id);
      res.status(200).json(matches);
    } catch (err) {
      next(err);
    }
  };
}
export default TournamentController;
