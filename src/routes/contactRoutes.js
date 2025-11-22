import { Router } from "express";
import { contactController } from "../di.js";
import contactValidator from "../validators/contactValidator.js";
import validate from "../middleware/Validation.js";

const router = Router();

// Envoyer un message *
router.post(
  "/contact",
  contactValidator.create,
  validate,
  contactController.createContactMessage
);

export default router;
