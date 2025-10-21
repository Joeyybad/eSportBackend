import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isConditionChecked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

    // --- Profil ---

    avatar: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    favoritesGames: {
      type: DataTypes.JSON, // array de strings
      defaultValue: [],
    },
    favoritesTeams: {
      type: DataTypes.JSON, // array de strings
      defaultValue: [],
    },

    // --- Statistiques ---
    betsWon: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    betsTotal: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "users",
    hooks: {
      beforeCreate: async (user) => {
        if (user.password && user.password !== "") {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password") && user.password !== "") {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
        }
      },
    },
  }
);

export default User;
