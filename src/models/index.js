import sequelize from "../config/database.js";
import Team from "./teamModel.js";
import Match from "./matchModel.js";
import Tournament from "./tournamentModel.js";
import User from "./userModel.js";
import Bet from "./betModel.js";
import Contact from "./contactModel.js";
// ============================
//       TEAM <--> MATCH
// ============================

Team.hasMany(Match, {
  as: "homeMatches",
  foreignKey: "homeTeamId",
  onDelete: "CASCADE",
});

Team.hasMany(Match, {
  as: "awayMatches",
  foreignKey: "awayTeamId",
  onDelete: "CASCADE",
});

Match.belongsTo(Team, {
  as: "homeTeam",
  foreignKey: "homeTeamId",
});

Match.belongsTo(Team, {
  as: "awayTeam",
  foreignKey: "awayTeamId",
});

// ============================
//     TOURNAMENT <--> MATCH
// ============================

Tournament.hasMany(Match, {
  foreignKey: "tournamentId",
  as: "matches",
  onDelete: "SET NULL",
});

Match.belongsTo(Tournament, {
  foreignKey: "tournamentId",
  as: "tournament",
});

// ============================
//        USER <--> BET
// ============================

User.hasMany(Bet, {
  as: "Bets",
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Bet.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// ============================
//        MATCH <--> BET
// ============================

Match.hasMany(Bet, {
  foreignKey: "matchId",
  onDelete: "CASCADE",
});

Bet.belongsTo(Match, {
  foreignKey: "matchId",
});

export { Team, Match, Tournament, User, Bet, Contact, sequelize };
