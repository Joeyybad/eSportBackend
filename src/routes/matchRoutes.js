import { Router } from "express";
import { matchController } from "../di.js";
import matchValidator from "../validators/MatchValidator.js";
import validate from "../middleware/Validation.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = Router();

// Lister tous les matchs
router.get("/", matchController.getAllMatches);

// Récupérer un match par ID
router.get("/:id", matchController.getMatchById);

// Créer un match
router.post(
  "/create/match",
  isAuthenticated(["admin"]),
  matchValidator.createMatch,
  validate,
  matchController.create
);

// Mettre à jour un match
router.put(
  "/:id",
  isAuthenticated(["admin"]),
  matchValidator.updateMatch,
  validate,
  matchController.update
);

// Mettre à jour le résultat d’un match
router.put(
  "/:id/result",
  isAuthenticated(["admin"]),
  matchController.updateMatchResult
);

// Supprimer un match
router.delete("/:id", isAuthenticated(["admin"]), matchController.delete);

export default router;
