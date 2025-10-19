import { validationResult } from "express-validator";
import User from "../models/User.js";

// Contrôleur utilisateur
export const registerUser = async (req, res) => {
  try {
    // 1️⃣ Validation des champs avec express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    // 2️⃣ Récupération des données du corps de la requête
    const { username, email, password, birthdate, isConditionChecked } =
      req.body;

    // 3️⃣ Vérification des champs obligatoires
    if (!username || !email || !password || !birthdate) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont obligatoires.",
      });
    }

    // Vérifier que l’utilisateur a coché la case des CGU
    if (!isConditionChecked) {
      return res.status(400).json({
        success: false,
        message:
          "Vous devez accepter les conditions générales d'utilisation (CGU).",
      });
    }

    // 4️⃣ Vérification si l’utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Un compte existe déjà avec cette adresse e-mail.",
      });
    }

    // 5️⃣ Création de l’utilisateur (le hash du mot de passe est géré par ton hook Sequelize)
    const newUser = await User.create({
      username,
      email,
      password,
      birthdate,
      isConditionChecked,
    });

    // 6️⃣ Réponse de succès
    return res.status(201).json({
      success: true,
      message: "Utilisateur inscrit avec succès.",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        birthdate: newUser.birthdate,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de l'inscription.",
    });
  }
};
