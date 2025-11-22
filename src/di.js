import UserService from "./services/UserService.js";
import TeamService from "./services/TeamService.js";
import MatchService from "./services/MatchService.js";
import TournamentService from "./services/TournamentService.js";
import BetService from "./services/BetService.js";
import ContactService from "./services/ContactService.js";

import UserController from "./controllers/userController.js";
import TeamController from "./controllers/teamController.js";
import MatchController from "./controllers/matchController.js";
import TournamentController from "./controllers/tournamentController.js";
import BetController from "./controllers/betController.js";
import ContactController from "./controllers/contactController.js";

// INITIALISATION DES SERVICES (singletons)
// export pour rendre accessibles aux JOBS
export const userService = new UserService();
export const teamService = new TeamService();
export const matchService = new MatchService();
export const tournamentService = new TournamentService();
export const betService = new BetService();
export const contactService = new ContactService();

// INITIALISATION DES CONTROLLERS (DI = dependency injection)
export const userController = new UserController(userService);
export const teamController = new TeamController(teamService);
export const matchController = new MatchController(matchService);
export const tournamentController = new TournamentController(tournamentService);
export const betController = new BetController(betService);
export const contactController = new ContactController(contactService);
