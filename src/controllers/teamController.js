import { validationResult } from "express-validator";
import Team from "../models/teamModel.js";
import dotenv from "dotenv";
dotenv.config();

//<---------- TeamController ---------->//

const teamController = {
  // lister toutes les équipes
  getAllTeams: async (req, res) => {
    try {
      const teams = await Team.findAll();
      res.json(teams);
    } catch (error) {
      console.error("Erreur lors de la récupération des équipes :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },
  // récupérer une équipe par son ID
  getTeamById: async (req, res) => {
    try {
      const team = await Team.findByPk(req.params.id);
      if (!team) {
        return res.status(404).json({ error: "Équipe non trouvée" });
      }
      res.json(team);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'équipe :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  //Créer une équipe
  createTeam: async (req, res) => {
    try {
      const { teamName, description, game } = req.body;
      const logo = req.file ? `/uploads/${req.file.filename}` : null;

      // ✅ Validation simple côté serveur
      if (!teamName || teamName.trim().length < 2) {
        return res.status(400).json({ message: "Nom d'équipe invalide" });
      }

      if (!game || game.trim().length < 2) {
        return res.status(400).json({ message: "Nom du jeu invalide" });
      }

      if (!description || description.trim().length < 10) {
        return res.status(400).json({ message: "Description trop courte" });
      }

      // Vérification si une équipe existe déjà
      const team = await Team.findOne({
        where: { teamName: teamName },
      });

      if (team) {
        const error = "Cette équipe existe déjà";
        return res.status(400).json({ message: error });
      } else {
        // Création de l’équipe
        const newTeam = await Team.create({
          teamName,
          description,
          game,
          logo,
        });

        return res.status(201).json({
          message: "Équipe créée avec succès",
          team: newTeam,
        });
      }
    } catch (error) {
      console.error("Erreur création équipe :", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  },

  // Mettre à jour une équipe
  updateTeam: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const team = await Team.findByPk(req.params.id);
      if (!team) {
        return res.status(404).json({ error: "Équipe non trouvée" });
      }
      const { teamName, description, game } = req.body;
      const logo = req.file ? `/uploads/${req.file.filename}` : team.logo;
      await team.update({ teamName, description, game, logo });
      res.json(team);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'équipe :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },
  // Supprimer une équipe
  deleteTeam: async (req, res) => {
    try {
      const team = await Team.findByPk(req.params.id);
      if (!team) {
        return res.status(404).json({ error: "Équipe non trouvée" });
      }
      await team.destroy();
      res.json({ message: "Équipe supprimée avec succès" });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'équipe :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },
};

export default teamController;
