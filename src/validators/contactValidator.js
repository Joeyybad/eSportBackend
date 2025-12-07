import { check } from "express-validator";

export default {
  create: [
    check("name").notEmpty().withMessage("Nom d'utilisateur requis"),

    check("email")
      .notEmpty()
      .withMessage("Email requis")
      .isEmail()
      .withMessage("Email invalide"),

    check("sujet").notEmpty().withMessage("Sujet requis"),

    check("message").notEmpty().withMessage("Texte requis"),
  ],
};
