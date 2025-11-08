import { validationResult } from "express-validator";
import Match from "../models/matchModel.js";
import dotenv from "dotenv";
dotenv.config();

//<---------- MatchController ---------->//

const matchController = {
  // lister tous les matchs
  getAllMatches: async (req, res) => {
    try {
      const matches = await Match.findAll({ order: [["date", "ASC"]] });
      res.json(matches);
    } catch (error) {
      console.error("Erreur lors de la récupération des matchs :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },
  // récupérer un match par son ID
  getMatchById: async (req, res) => {
    try {
      const match = await Match.findByPk(req.params.id);
      if (!match) {
        return res.status(404).json({ error: "Match non trouvé" });
      }
      res.json(match);
    } catch (error) {
      console.error("Erreur lors de la récupération du match :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },
  // créer un match
  create: async (req, res) => {
    try {
      const { homeTeamId, awayTeamId, oddsHome, oddsAway, matchDate } =
        req.body;

      if (homeTeamId === awayTeamId) {
        return res
          .status(400)
          .json({ message: "Une équipe ne peut pas jouer contre elle-même" });
      }

      const home = await Team.findByPk(homeTeamId);
      const away = await Team.findByPk(awayTeamId);

      if (!home || !away) {
        return res
          .status(404)
          .json({ message: "Une ou plusieurs équipes sont introuvables" });
      }

      const newMatch = await Match.create({
        homeTeamId,
        awayTeamId,
        oddsHome,
        oddsAway,
        matchDate,
      });

      return res.status(201).json({
        message: "Match créé avec succès",
        match: newMatch,
      });
    } catch (err) {
      console.error("Erreur création match :", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
  // mettre à jour un match
  update: async (req, res) => {
    try {
      const match = await Match.findByPk(req.params.id);
      if (!match) return res.status(404).json({ message: "Match introuvable" });

      await match.update(req.body);
      res.json({ message: "Match mis à jour", match });
    } catch (err) {
      console.error("Erreur update match:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
  //supprimer un match
  delete: async (req, res) => {
    try {
      const match = await Match.findByPk(req.params.id);
      if (!match) return res.status(404).json({ message: "Match introuvable" });

      await match.destroy();
      res.json({ message: "Match supprimé" });
    } catch (err) {
      console.error("Erreur delete match:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
};

export default matchController;
