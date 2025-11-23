import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Team from "./teamModel.js";

const Match = sequelize.define(
  "Match",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    homeTeamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Team,
        key: "id",
      },
    },

    awayTeamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Team,
        key: "id",
      },
    },

    oddsHome: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    oddsDraw: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 3.0,
    },
    oddsAway: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },

    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("scheduled", "live", "completed", "cancelled"),
      defaultValue: "scheduled",
    },
    result: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    event: {
      type: DataTypes.STRING,
      defaultValue: "Exhibition",
    },
    phase: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tournamentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "tournaments",
        key: "id",
      },
    },
  },
  {
    tableName: "matches",
    timestamps: true,
  }
);

export default Match;
