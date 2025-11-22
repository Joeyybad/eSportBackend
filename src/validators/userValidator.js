import { check } from "express-validator";

export default {
  signup: [
    check("username")
      .notEmpty()
      .withMessage("Nom d'utilisateur requis")
      .isLength({ min: 3 })
      .withMessage("3 caractères minimum"),

    check("email")
      .notEmpty()
      .withMessage("Email requis")
      .isEmail()
      .withMessage("Email invalide"),

    check("birthdate")
      .notEmpty()
      .withMessage("Date de naissance requise")
      .isISO8601()
      .withMessage("Veuillez entrer une date valide")
      .custom((value) => {
        const birthDate = new Date(value);
        const today = new Date();

        // Vérification : Date dans le futur
        if (birthDate > today) {
          throw new Error("La date de naissance doit être dans le passé");
        }

        // (IMPORTANT) Vérification : Moins de 18 ans
        // On calcule la date qu'il était il y a exactement 18 ans jour pour jour
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

        // Si la date de naissance est APRÈS la date limite (il y a 18 ans),
        // c'est que l'utilisateur < 18
        if (birthDate > eighteenYearsAgo) {
          throw new Error(
            "Vous devez avoir au moins 18 ans pour vous inscrire"
          );
        }

        return true;
      }),

    check("password")
      .notEmpty()
      .withMessage("Mot de passe requis")
      .isLength({ min: 8 })
      .withMessage("Le mot de passe doit contenir au moins 8 caractères.")
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
      ),

    // Confirmation du mot de passe
    check("confirmPassword")
      .notEmpty()
      .withMessage("Confirmation du mot de passe requise")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Les mots de passe doivent correspondre");
        }
        return true;
      }),

    // Conditions générales (checkbox)
    check("isConditionChecked").custom((value) => {
      // Le front envoie souvent "true"/"false" en string → on normalise
      const val = value === true || value === "true";

      if (!val) {
        throw new Error(
          "Veuillez accepter les conditions générales d'utilisation"
        );
      }
      return true;
    }),
  ],

  login: [
    check("email")
      .notEmpty()
      .withMessage("Email requis")
      .isEmail()
      .withMessage("Email invalide"),

    check("password").notEmpty().withMessage("Mot de passe requis"),
  ],
  updateProfile: [
    check("username")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Le pseudo doit contenir au moins 3 caractères."),

    check("birthdate")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Format de date de naissance invalide (AAAA-MM-JJ)."),

    check("avatar")
      .optional()
      .isString()
      .withMessage("Le champ avatar doit être une chaîne de caractères."),

    check("favoritesGames")
      .optional()
      .isArray()
      .withMessage(
        "Les jeux favoris doivent être envoyés sous forme de tableau (Array)."
      )
      .custom((value) =>
        value.every(
          (item) => typeof item === "string" && item.trim().length > 0
        )
      )
      .withMessage(
        "Chaque jeu favori doit être une chaîne de caractères non vide."
      ),

    check("favoritesTeams")
      .optional()
      .isArray()
      .withMessage(
        "Les équipes favorites doivent être envoyées sous forme de tableau (Array)."
      )
      .custom((value) =>
        value.every(
          (item) => typeof item === "string" && item.trim().length > 0
        )
      )
      .withMessage(
        "Chaque équipe favorite doit être une chaîne de caractères non vide."
      ),

    //  Gestion du mot de passe future Si le mot de passe est inclus dans une autre modale, assurez-vous de le valider ici aussi:
    // body("password").optional().isLength({ min: 8 }).withMessage("Le mot de passe doit contenir au moins 8 caractères."),
  ],
};
