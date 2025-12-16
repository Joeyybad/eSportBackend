import { check } from "express-validator";

export default {
  create: [
    check("name").notEmpty().withMessage("Nom d'utilisateur requis").escape(),

    check("email")
      .notEmpty()
      .withMessage("Email requis")
      .isEmail()
      .withMessage("Email invalide")
      .escape(),

    check("sujet").notEmpty().withMessage("Sujet requis").escape(),

    check("message").notEmpty().withMessage("Texte requis").escape(),
  ],
};
