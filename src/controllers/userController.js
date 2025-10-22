import { validationResult } from "express-validator";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//<---------- UserController ---------->//

const userController = {
  //Inscription d’un nouvel utilisateur

  signup: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      console.log("Body reçu :", req.body);

      const { confirmPassword, ...userData } = req.body; // retirer confirmPassword

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({
        where: { email: userData.email },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Un utilisateur avec cet email existe déjà." });
      }

      // Créer le nouvel utilisateur
      const newUser = await User.create(userData);

      return res.status(201).json({
        message: "Utilisateur créé avec succès.",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
      });
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      return res.status(500).json({ message: "Erreur interne du serveur." });
    }
  },

  // Connexion d’un utilisateur

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Vérifier que l'utilisateur existe
      const user = await User.findOne({ where: { email: email.trim() } });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Email ou mot de passe incorrect" });
      }

      // Vérifier le mot de passe
      const isMatch = await bcrypt.compare(password.trim(), user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Email ou mot de passe incorrect" });
      }

      // Générer un token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Retourner le token et infos utilisateur
      return res.status(200).json({
        message: "Connexion réussie",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
  // Récupérer le profil de l'utilisateur connecté
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id; // Récupérer l'ID utilisateur depuis le token

      // Trouver l'utilisateur dans la base de données
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Retourner les informations du profil
      return res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        birthdate: user.birthdate,
        avatar: user.avatar,
        favoritesGames: user.favoritesGames,
        favoritesTeams: user.favoritesTeams,
        betsWon: user.betsWon,
        betsTotal: user.betsTotal,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du profil :", error);
      return res.status(500).json({ message: "Erreur interne du serveur." });
    }
  },
  // Mettre à jour le profil de l'utilisateur connecté
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id; // Récupérer l'ID utilisateur depuis le token
      const { username, birthdate, avatar, favoritesGames, favoritesTeams } =
        req.body;
      // Trouver l'utilisateur dans la base de données
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      // Mettre à jour les informations du profil
      user.username = username || user.username;
      user.birthdate = birthdate || user.birthdate;
      user.avatar = avatar || user.avatar;
      user.favoritesGames = favoritesGames || user.favoritesGames;
      user.favoritesTeams = favoritesTeams || user.favoritesTeams;

      // Enregistrer les modifications
      await user.save();

      return res
        .status(200)
        .json({ message: "Profil mis à jour avec succès", user });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      return res.status(500).json({ message: "Erreur interne du serveur." });
    }
  },
  // Vérifier le token
  verifyToken: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(404).json({ valid: false });
      return res.status(200).json({ valid: true, user });
    } catch (error) {
      return res.status(500).json({ valid: false });
    }
  },
};

export default userController;
