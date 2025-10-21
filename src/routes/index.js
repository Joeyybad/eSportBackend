import express from "express";
import { body } from "express-validator";
import userController from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
const router = express.Router();

//<------------------- User Routes ------------------->//

// Inscription utilisateur
router.post(
  "/user/signup",
  [
    body("username")
      .notEmpty()
      .withMessage("Le nom d'utilisateur est requis.")
      .trim()
      .escape(),
    body("email")
      .notEmpty()
      .withMessage("L'adresse e-mail est requise.")
      .isEmail()
      .withMessage("L'adresse e-mail n'est pas valide.")
      .trim()
      .escape(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Le mot de passe doit comporter au moins 6 caractères.")
      .matches(/[a-z]/)
      .withMessage(
        "Le mot de passe doit contenir au moins une lettre minuscule."
      )
      .matches(/[A-Z]/)
      .withMessage(
        "Le mot de passe doit contenir au moins une lettre majuscule."
      )
      .matches(/[0-9]/)
      .withMessage("Le mot de passe doit contenir au moins un chiffre.")
      .matches(/[!@#$%^&*(),.?\":{}|<>]/)
      .withMessage(
        "Le mot de passe doit contenir au moins un caractère spécial."
      )
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error("Les mots de passe ne correspondent pas.");
        }
        return true;
      })
      .trim()
      .escape(),
    body("birthdate")
      .notEmpty()
      .withMessage("La date de naissance est requise.")
      .isDate()
      .withMessage("La date de naissance n'est pas valide."),
    body("isConditionChecked").custom((value) => {
      if (!value) {
        throw new Error(
          "Vous devez accepter les conditions générales d'utilisation."
        );
      }
      return true;
    }),
  ],
  userController.signup
);

// Connexion utilisateur
router.post(
  "/user/login",
  [
    body("email")
      .notEmpty()
      .withMessage("L'adresse e-mail est requise")
      .isEmail()
      .withMessage("L'adresse e-mail invalide")
      .trim()
      .escape(),
    body("password")
      .notEmpty()
      .withMessage("Le mot de passe est requis")
      .isLength({ min: 6 })
      .withMessage("Le mot de passe ne respecte pas les critères requis")
      .trim()
      .escape(),
  ],
  userController.login
);

// Récupérer le profil de l'utilisateur connecté
router.get("/user/profile", isAuthenticated(), userController.getProfile);

export default router;
