import { validationResult } from "express-validator";
import Match from "../models/matchModel.js";
import Team from "../models/teamModel.js";
import Bet from "../models/betModel.js";
import Tournament from "../models/tournamentModel.js";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

//<---------- MatchController ---------->//

const matchController = {
  // lister tous les matchs
  getAllMatches: async (req, res) => {
    try {
      const matches = await Match.findAll({
        include: [
          {
            model: Team,
            as: "homeTeam",
            attributes: ["id", "teamName", "logo", "game"],
          },
          {
            model: Team,
            as: "awayTeam",
            attributes: ["id", "teamName", "logo", "game"],
          },
        ],
        order: [["date", "ASC"]],
      });

      res.status(200).json(matches);
    } catch (err) {
      console.error("Erreur récupération matchs :", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
  // récupérer un match par son ID
  getMatchById: async (req, res) => {
    try {
      const match = await Match.findByPk(req.params.id, {
        include: [
          {
            model: Team,
            as: "homeTeam",
            attributes: ["id", "teamName", "logo"],
          },
          {
            model: Team,
            as: "awayTeam",
            attributes: ["id", "teamName", "logo"],
          },
        ],
      });

      if (!match) {
        return res.status(404).json({ message: "Match introuvable" });
      }

      res.json(match);
    } catch (err) {
      console.error("Erreur récupération match :", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
  // créer un match
  create: async (req, res) => {
    try {
      const {
        homeTeamId,
        awayTeamId,
        oddsHome,
        oddsAway,
        oddsDraw,
        matchDate,
        phase,
        tournamentId,
      } = req.body;
      console.log("Données reçues pour création de match :", req.body);

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
      const now = new Date();
      const matchStart = new Date(matchDate);

      // Durée du match
      const matchDurationMinutes = 120;
      const matchEnd = new Date(
        matchStart.getTime() + matchDurationMinutes * 60000
      );

      let status = "scheduled";
      if (now >= matchStart && now <= matchEnd) {
        status = "live";
      } else if (now > matchEnd) {
        status = "completed";
      }
      // Récupérer le nom du tournoi si tournamentId est fourni
      let eventName = "Exhibition";
      if (tournamentId) {
        const tournament = await Tournament.findByPk(tournamentId);
        if (!tournament) {
          return res
            .status(404)
            .json({ message: "Tournoi introuvable pour ce match" });
        }
        eventName = tournament.name; // utiliser le nom du tournoi
      }

      const newMatch = await Match.create({
        homeTeamId,
        awayTeamId,
        oddsHome,
        oddsAway,
        oddsDraw,
        date: matchDate,
        status,
        event: eventName,
        phase: phase || null,
        tournamentId: tournamentId || null,
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
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const {
        homeTeamId,
        awayTeamId,
        oddsHome,
        oddsAway,
        oddsDraw,
        date,
        status,
        scoreHome,
        scoreAway,
        result,
      } = req.body;

      const match = await Match.findByPk(id);
      if (!match) return res.status(404).json({ message: "Match introuvable" });

      // Mise à jour dynamique
      if (homeTeamId) match.homeTeamId = homeTeamId;
      if (awayTeamId) match.awayTeamId = awayTeamId;
      if (oddsHome) match.oddsHome = oddsHome;
      if (oddsDraw) match.oddsDraw = oddsDraw;
      if (oddsAway) match.oddsAway = oddsAway;
      if (date) match.date = date;
      if (status) match.status = status;
      if (scoreHome !== undefined) match.scoreHome = scoreHome;
      if (scoreAway !== undefined) match.scoreAway = scoreAway;
      if (result) match.result = result;

      await match.save();

      res.status(200).json({ message: "Match mis à jour avec succès", match });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du match :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
  // mettre à jour le résultat d'un match
  updateMatchResult: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { id } = req.params;
      const { result } = req.body; // "home" | "away" | "draw"

      const match = await Match.findByPk(id);
      if (!match) return res.status(404).json({ message: "Match introuvable" });

      // Mise à jour du match
      match.status = "completed";
      match.result = result;
      await match.save();

      // Récupérer les paris du match
      const bets = await Bet.findAll({ where: { matchId: match.id } });

      for (const bet of bets) {
        const user = await User.findByPk(bet.userId);

        if (bet.prediction === result) {
          const gain = bet.amount * bet.odds;

          await bet.update({
            status: "won",
            gain,
          });

          await user.update({
            betsWon: (user.betsWon || 0) + 1,
            totalEarnings: (user.totalEarnings || 0) + gain,
          });
        } else {
          await bet.update({
            status: "lost",
            gain: 0,
          });
        }
      }

      res.json({ message: "Résultat mis à jour et gains calculés." });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du match :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
  MatchByTournament: async (req, res) => {
    try {
      const matches = await Match.findAll({
        where: { tournamentId: req.params.id },
        include: [
          {
            model: Team,
            as: "homeTeam",
            attributes: ["id", "teamName", "logo"],
          },
          {
            model: Team,
            as: "awayTeam",
            attributes: ["id", "teamName", "logo"],
          },
          {
            model: Tournament,
            as: "tournament",
            attributes: ["id", "name", "game", "status"],
          },
        ],
        order: [["date", "ASC"]],
      });

      res.json(matches);
    } catch (err) {
      console.error("Erreur récupération matchs par tournoi :", err);
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
