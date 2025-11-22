import { check } from "express-validator";

export default {
  create: [
    check("matchId")
      .notEmpty()
      .withMessage("L'ID du match est requis")
      .isInt()
      .withMessage("matchId doit être un entier"),

    check("prediction")
      .notEmpty()
      .withMessage("Choisis une équipe !")
      .isIn(["home", "away", "draw"])
      .withMessage("Prédiction invalide"),

    check("amount")
      .notEmpty()
      .withMessage("Indique un montant !")
      .isFloat({ min: 1 })
      .withMessage("Montant minimal : 1"),
  ],
};
