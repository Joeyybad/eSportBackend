import { Router } from "express";
import { tournamentController } from "../di.js";
import tournamentValidator from "../validators/tournamentValidator.js";
import validate from "../middleware/Validation.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = Router();

// Lister tous les tournois
router.get("/", tournamentController.getAll);

// Récupérer un tournoi par ID
router.get("/:id", tournamentController.getById);

// Créer un tournoi
router.post(
  "/create",
  isAuthenticated(["admin"]),
  tournamentValidator.create,
  validate,
  tournamentController.create
);

// Récupérer les matchs d’un tournoi
router.get("/:id/matches", tournamentController.getMatches);

// Mettre à jour un tournoi
router.put(
  "/:id",
  isAuthenticated(["admin"]),
  tournamentValidator.update,
  validate,
  tournamentController.update
);

// Supprimer un tournoi
router.delete("/:id", isAuthenticated(["admin"]), tournamentController.delete);

export default router;
