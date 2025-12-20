import UserRepository from "./repositories/UserRepository.js";
import MatchRepository from "./repositories/MatchRepository.js";
import TeamRepository from "./repositories/TeamRepository.js";
import BetRepository from "./repositories/BetRepository.js";
import ContactRepository from "./repositories/ContactRepository.js";
import TournamentRepository from "./repositories/TournamentRepository.js";

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

// INITIALISATION DES REPOSITORIES
const userRepository = new UserRepository();
const teamRepository = new TeamRepository();
const matchRepository = new MatchRepository();
const betRepository = new BetRepository();
const contactRepository = new ContactRepository();
const tournamentRepository = new TournamentRepository();

// INITIALISATION DES SERVICES (singletons)
export const userService = new UserService(userRepository);
export const teamService = new TeamService(teamRepository);
export const matchService = new MatchService(matchRepository);
export const betService = new BetService(
  betRepository,
  matchRepository,
  userRepository
);
export const contactService = new ContactService(contactRepository);
export const tournamentService = new TournamentService(
  tournamentRepository,
  matchRepository
);

// INITIALISATION DES CONTROLLERS
export const userController = new UserController(userService);
export const teamController = new TeamController(teamService);
export const matchController = new MatchController(matchService);
export const tournamentController = new TournamentController(tournamentService);
export const betController = new BetController(betService);
export const contactController = new ContactController(contactService);
