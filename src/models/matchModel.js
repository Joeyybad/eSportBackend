import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Team from "./teamModel.js";

const Match = sequelize.define(
  "Match",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    homeTeam: { type: DataTypes.STRING, allowNull: false },
    awayTeam: { type: DataTypes.STRING, allowNull: false },
    oddsHome: { type: DataTypes.FLOAT, allowNull: false },
    oddsAway: { type: DataTypes.FLOAT, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    result: { type: DataTypes.STRING, allowNull: true },
    status: {
      type: DataTypes.ENUM("pending", "live", "finished"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "matches",
    timestamps: true,
  }
);

Match.belongsTo(Team, { as: "homeTeam", foreignKey: "homeTeamId" });
Match.belongsTo(Team, { as: "awayTeam", foreignKey: "awayTeamId" });

Team.hasMany(Match, { as: "homeMatches", foreignKey: "homeTeamId" });
Team.hasMany(Match, { as: "awayMatches", foreignKey: "awayTeamId" });

export default Match;
