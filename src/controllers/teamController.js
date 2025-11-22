class TeamController {
  constructor(teamService) {
    this.service = teamService;
  }
  // Récupérer toutes les équipes
  getAll = async (req, res) => {
    try {
      const teams = await this.service.getAll();
      res.json(teams);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  // Récupérer l'équipe par Id
  getById = async (req, res) => {
    try {
      const team = await this.service.getById(req.params.id);
      if (!team) return res.status(404).json({ message: "Équipe introuvable" });

      res.json(team);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  // Créer une équipe
  create = async (req, res) => {
    try {
      const data = { ...req.body };
      if (req.file) data.logo = req.file.filename;

      const team = await this.service.create(data);
      res.status(201).json(team);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  //Modifier une équipe *
  update = async (req, res) => {
    try {
      const data = { ...req.body };
      if (req.file) data.logo = req.file.filename;

      const team = await this.service.update(req.params.id, data);
      if (!team) return res.status(404).json({ message: "Équipe introuvable" });

      res.json(team);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  // Supprimer une équipe *
  delete = async (req, res) => {
    try {
      const success = await this.service.delete(req.params.id);
      if (!success)
        return res.status(404).json({ message: "Équipe introuvable" });

      res.json({ message: "Équipe supprimée" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}
export default TeamController;
