class TeamController {
  constructor(teamService) {
    this.service = teamService;
  }
  // Récupérer toutes les équipes
  getAll = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
      const teams = await this.service.getAll(page, limit);
      res.json(teams);
    } catch (err) {
      next(err);
    }
  };
  // Récupérer l'équipe par Id
  getById = async (req, res, next) => {
    try {
      const team = await this.service.getById(req.params.id);
      if (!team) return res.status(404).json({ message: "Équipe introuvable" });

      res.json(team);
    } catch (err) {
      next(err);
    }
  };
  // Créer une équipe
  create = async (req, res, next) => {
    try {
      const data = { ...req.body };
      if (req.file) data.logo = req.file.filename;

      const team = await this.service.create(data);
      res.status(201).json(team);
    } catch (err) {
      next(err);
    }
  };
  //Modifier une équipe
  update = async (req, res, next) => {
    try {
      const { id } = req.params; // L'ID dans l'URL

      const team = await this.service.update(
        id,
        req.body,
        req.file // Le fichier image (Multer)
      );

      if (!team) {
        return res.status(404).json({ message: "Équipe introuvable" });
      }

      res.json(team);
    } catch (err) {
      next(err);
    }
  };
  // Supprimer une équipe *
  delete = async (req, res, next) => {
    try {
      const success = await this.service.delete(req.params.id);
      if (!success)
        return res.status(404).json({ message: "Équipe introuvable" });

      res.json({ message: "Équipe supprimée" });
    } catch (err) {
      next(err);
    }
  };
}
export default TeamController;
