import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Team = sequelize.define(
  "Team",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    teamName: { type: DataTypes.STRING, allowNull: false },
    logo: { type: DataTypes.STRING, allowNull: true },
    game: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },

    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "teams",
    timestamps: true,
  }
);

export default Team;
