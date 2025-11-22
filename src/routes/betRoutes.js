import { Router } from "express";
import { betController } from "../di.js";
import betValidator from "../validators/betValidator.js";
import validate from "../middleware/Validation.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = Router();

// Récupérer les paris de l’utilisateur connecté
router.get("/user", isAuthenticated(), betController.getUserBets);

// Créer un pari
router.post(
  "/",
  isAuthenticated(),
  betValidator.create,
  validate,
  betController.create
);

export default router;
