import { check, param } from "express-validator";

export default {
  createMatch: [
    check("homeTeamId").isInt().withMessage("homeTeamId doit être un entier"),
    check("awayTeamId").isInt().withMessage("awayTeamId doit être un entier"),
    check("oddsHome").isFloat().withMessage("oddsHome doit être un nombre"),
    check("oddsDraw")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("oddsDraw doit être positif ou 0"),
    check("oddsAway").isFloat().withMessage("oddsAway doit être un nombre"),
    check("date")
      .notEmpty()
      .withMessage("La date du match est obligatoire")
      .isISO8601()
      .withMessage("Date invalide. Format attendu : AAAA-MM-JJTHH:MM:SSZ"),
  ],

  deleteMatch: [
    param("id").isInt().withMessage("L'id doit être un entier valide"),
  ],
  updateMatch: [
    param("id").isInt().withMessage("L'id doit être un entier"),

    check("homeTeamId")
      .optional()
      .isInt()
      .withMessage("homeTeamId doit être un entier"),

    check("awayTeamId")
      .optional()
      .isInt()
      .withMessage("awayTeamId doit être un entier"),

    check("oddsHome")
      .optional()
      .isFloat()
      .withMessage("oddsHome doit être un nombre"),

    check("oddsAway")
      .optional()
      .isFloat()
      .withMessage("oddsAway doit être un nombre"),

    check("oddsDraw")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("oddsDraw doit être positif ou 0"),

    check("date").optional().isISO8601().withMessage("date invalide"),

    check("status")
      .optional()
      .isIn(["scheduled", "live", "completed", "cancelled"])
      .withMessage("status invalide"),

    check("result")
      .optional()
      .isString()
      .withMessage("result doit être une chaîne de caractères"),

    check("event")
      .optional()
      .isString()
      .withMessage("event doit être une chaîne de caractères"),

    check("phase")
      .optional()
      .isString()
      .withMessage("phase doit être une chaîne de caractères"),

    check("tournamentId")
      .optional()
      .isInt()
      .withMessage("tournamentId doit être un entier"),
  ],
};
