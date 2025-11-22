import { Router } from "express";
import { teamController } from "../di.js";
import teamValidator from "../validators/teamValidator.js";
import validate from "../middleware/Validation.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import upload from "../config/multer-config.js";

const router = Router();

// Liste des équipes
router.get("/", isAuthenticated(["admin"]), teamController.getAll);

// équipe par ID *
router.get("/:id", teamController.getById);

// Création d'équipe
router.post(
  "/",
  isAuthenticated(["admin"]),
  upload.single("logo"),
  teamValidator.create,
  validate,
  teamController.create
);

// Modification de l'équipe *
router.put(
  "/:id",
  isAuthenticated(["admin"]),
  upload.single("logo"),
  teamValidator.update,
  validate,
  teamController.update
);

// Suppresion d'équipe
router.delete("/:id", isAuthenticated(["admin"]), teamController.delete);

export default router;
