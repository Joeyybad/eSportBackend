import { Tournament, Match, Team } from "../models/index.js";
import { validationResult } from "express-validator";

const tournamentController = {
  getTournament: async (req, res) => {
    try {
      const { game } = req.query;

      const whereClause = game ? { game } : {};

      const tournaments = await Tournament.findAll({
        where: whereClause,
        include: [
          {
            model: Match,
            as: "matches",
            attributes: ["id", "date"],
          },
        ],
        order: [["startDate", "ASC"]],
      });

      res.json(tournaments);
    } catch (err) {
      console.error("Erreur récupération tournois :", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
  getTournamentById: async (req, res) => {
    try {
      const tournament = await Tournament.findByPk(req.params.id);

      if (!tournament) {
        return res.status(404).json({ message: "Tournoi introuvable" });
      }

      res.json(tournament);
    } catch (err) {
      console.error("Erreur récupération tournoi :", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },

  createTournament: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, game, description, startDate, endDate } = req.body;

      if (!name || !startDate || !game) {
        return res
          .status(400)
          .json({ message: "Nom, jeu et date de début requis" });
      }

      const tournament = await Tournament.create({
        name,
        game,
        description,
        startDate,
        endDate,
      });

      res.status(201).json(tournament);
    } catch (err) {
      console.error("Erreur création tournoi :", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, startDate, endDate, game, status } = req.body;

      const tournament = await Tournament.findByPk(id);
      if (!tournament)
        return res.status(404).json({ message: "Tournoi introuvable" });

      if (name) tournament.name = name;
      if (description !== undefined) tournament.description = description;
      if (startDate) tournament.startDate = startDate;
      if (endDate) tournament.endDate = endDate;
      if (game) tournament.game = game;
      if (status) tournament.status = status;

      await tournament.save();
      res.json({ message: "Tournoi mis à jour avec succès", tournament });
    } catch (err) {
      console.error("Erreur mise à jour tournoi :", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const tournament = await Tournament.findByPk(id);

      if (!tournament)
        return res.status(404).json({ message: "Tournoi introuvable" });

      // Supprimer les matchs liés
      await Match.destroy({ where: { tournamentId: id } });

      // Puis supprimer le tournoi
      await tournament.destroy();

      res.json({ message: "Tournoi supprimé avec succès" });
    } catch (err) {
      console.error("Erreur suppression tournoi :", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
};

export default tournamentController;
