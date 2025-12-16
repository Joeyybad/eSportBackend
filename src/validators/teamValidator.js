import { check } from "express-validator";

export default {
  create: [
    check("teamName")
      .notEmpty()
      .withMessage("Nom de l’équipe requis")
      .isLength({ min: 2 })
      .withMessage("2 caractères minimum")
      .escape(),

    check("game")
      .notEmpty()
      .withMessage("Jeu principal requis")
      .isLength({ min: 2 })
      .withMessage("2 caractères minimum")
      .escape(),

    check("description")
      .notEmpty()
      .withMessage("Description requise")
      .isLength({ min: 10 })
      .withMessage("10 caractères minimum")
      .escape(),
  ],

  update: [
    check("teamName")
      .optional()
      .isLength({ min: 2 })
      .withMessage("2 caractères minimum")
      .escape(),

    check("game")
      .optional()
      .isLength({ min: 2 })
      .withMessage("2 caractères minimum")
      .escape(),

    check("description")
      .optional()
      .isLength({ min: 10 })
      .withMessage("10 caractères minimum")
      .escape(),
  ],
};
