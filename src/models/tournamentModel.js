import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Tournament = sequelize.define(
  "Tournament",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    game: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("scheduled", "live", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "scheduled",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "tournaments",
  }
);

export default Tournament;
