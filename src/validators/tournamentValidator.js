import { check } from "express-validator";

export default {
  create: [
    check("name").notEmpty().withMessage("Nom du tournoi requis"),

    check("game").notEmpty().withMessage("Jeu requis"),

    check("description").optional(),

    check("startDate")
      .notEmpty()
      .withMessage("Date de début requise")
      .isISO8601()
      .withMessage("Veuillez entrer une date valide"),

    check("endDate")
      .optional()
      .isISO8601()
      .withMessage("Veuillez entrer une date valide")
      .custom((value, { req }) => {
        if (value && new Date(value) < new Date(req.body.startDate)) {
          throw new Error("La date de fin doit être après le début");
        }
        return true;
      }),
  ],

  update: [
    check("name").notEmpty().withMessage("Nom du tournoi requis"),

    check("description").optional(),

    check("game").notEmpty().withMessage("Jeu requis"),

    check("startDate")
      .notEmpty()
      .withMessage("Date de début requise")
      .isISO8601()
      .withMessage("Date invalide"),

    check("endDate")
      .notEmpty()
      .withMessage("Date de fin requise")
      .isISO8601()
      .withMessage("Date invalide")
      .custom((value, { req }) => {
        if (new Date(value) < new Date(req.body.startDate)) {
          throw new Error("La date de fin doit être après la date de début");
        }
        return true;
      }),

    check("status")
      .notEmpty()
      .withMessage("Statut requis")
      .isIn(["scheduled", "live", "completed"])
      .withMessage("Statut invalide"),
  ],
};
