import express from "express";
import { body } from "express-validator";
import userController from "../controllers/userController.js";
import matchController from "../controllers/matchController.js";
import teamController from "../controllers/teamController.js";
import betController from "../controllers/betController.js";
import contactController from "../controllers/contactController.js";
import tournamentController from "../controllers/tournamentController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import upload from "../config/multer-config.js";
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

// Mettre à jour le profil de l'utilisateur connecté
router.put(
  "/user/profile",
  isAuthenticated(),
  [
    body("email")
      .notEmpty()
      .withMessage("Données incorrectes")
      .isEmail()
      .withMessage("Données incorrectes")
      .trim()
      .escape(),
    body("pseudo")
      .notEmpty()
      .withMessage("Données incorrectes")
      .isLength({ min: 2 })
      .withMessage("Données incorrectes")
      .trim()
      .escape(),
    body("avatar")
      .optional()
      .isURL()
      .withMessage("Données incorrectes")
      .trim()
      .escape(),
    //body("password")
    //   .optional() // Le mot de passe est facultatif
    //   .isLength({ min: 6 })
    // .withMessage("Données incorrectes")
    // .matches(/[a-z]/)
    // .withMessage("Données incorrectes")
    // .matches(/[A-Z]/)
    // .withMessage("Données incorrectes")
    // .matches(/[0-9]/)
    // .withMessage("Données incorrectes")
    // .matches(/[!@#$%^&*(),.?":{}|<>]/)
    // .withMessage("Données incorrectes")
    // .custom((value, { req }) => {
    //   if (value && value !== req.body.confPassword) {
    //     throw new Error("Les mots de passe ne correspondent pas.");
    //   }
    //   return true;
    // })
    // .trim()
    // .escape(),
    body("favoritesGames")
      .optional({ checkFalsy: true }) // champ est optionnel
      .isArray()
      .withMessage("Le format des jeux favoris est incorrect"),

    body("favoritesTeams")
      .optional({ checkFalsy: true })
      .isArray()
      .withMessage("Le format des équipes favorites est incorrect"),
  ],
  upload.single("avatar"),
  userController.updateProfile
);

// Vérifier le token
router.get("/user/verify", isAuthenticated(), userController.verifyToken);

//<------------------- Fin User Routes ------------------->//

//<------------------- Matchs Routes ------------------->//

// Lister tous les matchs
router.get("/matches", matchController.getAllMatches);

// Récupérer un match par son ID
router.get("/match/:id", matchController.getMatchById);

// Créer un match
router.post(
  "/create/match",
  isAuthenticated(["admin"]),
  [
    body("homeTeam")
      .notEmpty()
      .withMessage("Le nom de l'équipe à domicile est requis")
      .isLength({ min: 2 })
      .withMessage(
        "Le nom de l'équipe à domicile doit contenir au moins 2 caractères"
      )
      .trim()
      .escape(),

    body("awayTeam")
      .notEmpty()
      .withMessage("Le nom de l'équipe à l'extérieur est requis")
      .isLength({ min: 2 })
      .withMessage(
        "Le nom de l'équipe à l'extérieur doit contenir au moins 2 caractères"
      )
      .trim()
      .escape(),

    body("matchDate")
      .notEmpty()
      .withMessage("La date du match est requise")
      .isISO8601()
      .withMessage("La date du match doit être au format ISO 8601")
      .toDate(),

    body("oddsHome")
      .notEmpty()
      .withMessage("La cote pour l'équipe à domicile est requise")
      .isFloat()
      .withMessage("La cote pour l'équipe à domicile doit être un nombre")
      .custom((value) => {
        if (value <= 0) {
          throw new Error(
            "La cote pour l'équipe à domicile doit être positive"
          );
        }
        return true;
      }),

    body("oddsAway")
      .notEmpty()
      .withMessage("La cote pour l'équipe à l'extérieur est requise")
      .isFloat()
      .withMessage("La cote pour l'équipe à l'extérieur doit être un nombre")
      .custom((value) => {
        if (value <= 0) {
          throw new Error(
            "La cote pour l'équipe à l'extérieur doit être positive"
          );
        }
        return true;
      }),
  ],
  matchController.create
);

// Mettre à jour un match
router.put("/match/:id", isAuthenticated(["admin"]), matchController.update);

//Mettre à jour le résultat d'un match
router.put(
  "/match/:id/result",
  isAuthenticated(["admin"]),
  matchController.updateMatchResult
);

// Supprimer un match
router.delete("/match/:id", isAuthenticated(["admin"]), matchController.delete);

//<------------------- Fin Matchs Routes ------------------->//

//<------------------- Début Tournaments Routes ------------------->//

//Match par tournois
router.get("/tournaments/:id/matches", matchController.MatchByTournament);

// Lister tous les tournois
router.get("/tournaments", tournamentController.getTournament);
// Récupérer un tournoi par son ID
router.get("/tournaments/:id", tournamentController.getTournamentById);

router.post(
  "/tournaments",
  [
    body("name")
      .notEmpty()
      .withMessage("Le nom du tournoi est requis")
      .isLength({ min: 2 })
      .withMessage("Le nom du tournoi doit contenir au moins 2 caractères")
      .trim()
      .escape(),
    body("description")
      .notEmpty()
      .withMessage("La description du tournoi est requise")
      .isLength({ min: 10 })
      .withMessage(
        "La description du tournoi doit contenir au moins 10 caractères"
      )
      .trim()
      .escape(),
    body("startDate")
      .notEmpty()
      .withMessage("La date de début est requise")
      .isISO8601()
      .withMessage("La date de début doit être au format ISO 8601")
      .toDate(),
    body("endDate")
      .optional()
      .isISO8601()
      .withMessage("La date de fin doit être au format ISO 8601")
      .toDate(),
  ],
  isAuthenticated(["admin"]),
  tournamentController.createTournament
);
router.put("/:id", isAuthenticated(["admin"]), tournamentController.update);

router.delete(
  "/tournaments/:id",
  isAuthenticated(["admin"]),
  tournamentController.delete
);

//<------------------- Fin Tournaments Routes ------------------->//

//<------------------- Team Routes ------------------->//

// Lister toutes les équipes
router.get("/admin/teams", isAuthenticated(), teamController.getAllTeams);

// Récupérer une équipe par son ID
router.get("/team/:id", teamController.getTeamById);

// Créer une équipe
router.post(
  "/create/team",
  isAuthenticated(["admin"]),
  upload.single("logo"),
  teamController.createTeam
);

// Mettre à jour une équipe
router.put(
  "/team/:id",
  isAuthenticated(),
  [
    body("teamName")
      .notEmpty()
      .withMessage("Le nom de l'équipe est requis")
      .isLength({ min: 2 })
      .withMessage("Le nom de l'équipe doit contenir au moins 2 caractères")
      .trim()
      .escape(),
    body("game")
      .notEmpty()
      .withMessage("Le nom du jeu est requis")
      .isLength({ min: 2 })
      .withMessage("Le nom du jeu doit contenir au moins 2 caractères")
      .trim()
      .escape(),
    body("description")
      .notEmpty()
      .withMessage("La description de l'équipe est requise")
      .isLength({ min: 10 })
      .withMessage(
        "La description de l'équipe doit contenir au moins 10 caractères"
      )
      .trim()
      .escape(),
  ],
  upload.single("logo"),
  teamController.updateTeam
);

// Supprimer une équipe
router.delete("/team/:id", isAuthenticated(), teamController.deleteTeam);

//<------------------- Fin Team Routes ------------------->//

//<------------------- Bets Routes ------------------->//

router.get("/bets/user", isAuthenticated(), betController.getBetsByUser);
router.post(
  "/bets",
  isAuthenticated(),
  [
    body("matchId")
      .notEmpty()
      .withMessage("L'ID du match est requis.")
      .isInt({ min: 1 })
      .withMessage("L'ID du match doit être un nombre valide."),

    body("amount")
      .notEmpty()
      .withMessage("Le montant est requis.")
      .isFloat({ min: 0.1 })
      .withMessage("Le montant doit être supérieur à 0."),

    body("prediction")
      .notEmpty()
      .withMessage("La prédiction est obligatoire.")
      .isIn(["home", "away", "draw"])
      .withMessage("La prédiction doit être 'home', 'away' ou 'draw'."),
  ],
  betController.createBet
);
//<------------------- Fin Bets Routes ------------------->//

//<------------------- Contact Routes ------------------->//

router.post(
  "/contact",
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
      .withMessage("L'adresse e-mail doit être valide.")
      .normalizeEmail(),
    body("message")
      .notEmpty()
      .withMessage("Le message est requis.")
      .trim()
      .escape(),
  ],
  contactController.createContactMessage
);

//<------------------- Fin Contact Routes ------------------->//

export default router;
