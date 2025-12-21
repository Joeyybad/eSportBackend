// @ts-check

/**
 * On importe les types d'Express pour l'autocomplétion
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * import { BetService } from '../services/BetService.js';
 * (Ajuste le chemin '../services/BetService.js' si nécessaire)
 * @typedef {import('../services/BetService').default} BetService
 */

class BetController {
  /**
   *
   * @param {BetService} betService - Instance typée du service
   */
  constructor(betService) {
    this.service = betService;
  }

  /**
   * Récupère tous les paris de l'utilisateur connecté
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */

  // regroupe les paris par user
  getUserBets = async (req, res, next) => {
    try {
      // @ts-ignore (req.user est ajouté par un middleware custom)
      const bets = await this.service.getByUser(req.user.id);
      res.json(bets);
    } catch (err) {
      next(err);
    }
  };
  /**
   * Récupère tous les paris de l'utilisateur connecté
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */

  //Crée un paris
  create = async (req, res, next) => {
    try {
      // @ts-ignore
      console.log("Token Payload (req.user):", req.user);
      // @ts-ignore
      const userId = req.user?.id;

      // Gestion centralisée même pour le 401
      if (!userId) {
        const error = new Error("Utilisateur non authentifié (ID manquant).");
        // @ts-ignore (On ajoute dynamiquement la propriété status)
        error.status = 401;
        throw error;
      }
      const bet = await this.service.create({
        ...req.body,
        userId: userId,
      });
      res.status(201).json(bet);
    } catch (err) {
      next(err);
    }
  };
}

export default BetController;
