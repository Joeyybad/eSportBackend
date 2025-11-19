import Contact from "../models/contactModel.js";
import { validationResult } from "express-validator";

const contactController = {
  // Créer un nouveau message de contact
  createContactMessage: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, sujet, message } = req.body;
      const newMessage = await Contact.create({
        name,
        email,
        sujet,
        message,
      });

      res.status(201).json(newMessage);
    } catch (error) {
      console.error("Erreur création message de contact :", error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },
};

export default contactController;
