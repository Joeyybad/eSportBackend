import Bet from "../models/betModel.js";
import Match from "../models/matchModel.js";
import User from "../models/userModel.js";
import Team from "../models/teamModel.js";
import { validationResult } from "express-validator";

const betController = {
  // Récupérer les paris d’un utilisateur
  getBetsByUser: async (req, res) => {
    try {
      const userId = req.user.id;

      const bets = await Bet.findAll({
        where: { userId },
        include: [
          {
            model: Match,
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
            attributes: [
              "id",
              "date",
              "status",
              "oddsHome",
              "oddsAway",
              "oddsDraw",
              "result",
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.json(bets);
    } catch (error) {
      console.error("Erreur getBetsByUser:", error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },
  // Créer un paris
  createBet: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { matchId, amount, prediction } = req.body;
      const userId = req.user.id; // récupéré depuis le middleware auth

      const match = await Match.findByPk(matchId);
      if (!match) return res.status(404).json({ message: "Match introuvable" });

      // Déterminer la cote en fonction du pari
      let odds = 1;
      if (prediction === "home") odds = match.oddsHome;
      else if (prediction === "away") odds = match.oddsAway;
      else odds = 3.0; // exemple pour match nul

      const bet = await Bet.create({
        matchId,
        userId,
        amount,
        prediction,
        odds,
      });

      // Mets à jour les stats du joueur
      await User.increment("betsTotal", { where: { id: userId } });

      res.status(201).json({ message: "Pari enregistré avec succès", bet });
    } catch (error) {
      console.error("Erreur lors de la création du pari :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
};

export default betController;
