class ContactController {
  constructor(contactService) {
    this.service = contactService;
  }

  // Créer un nouveau message de contact
  createContactMessage = async (req, res) => {
    try {
      const { name, email, sujet, message } = req.body;

      // ✅ AMÉLIORATION : Si l'utilisateur est connecté (token JWT), on récupère son ID
      // req.user est rempli par ton middleware d'auth (s'il est présent sur la route)
      const userId = req.user ? req.user.id : null;

      const newMessage = await this.service.create({
        userId, // On lie le message au compte
        name,
        email,
        sujet,
        message,
      });

      res.status(201).json(newMessage);
    } catch (err) {
      console.error("Erreur Contact Controller:", err);
      res.status(500).json({ message: "Erreur lors de l'envoi du message." });
    }
  };

  // (Optionnel) Pour l'admin : Voir les messages
  getAllMessages = async (req, res) => {
    try {
      const messages = await this.service.getAll();
      res.json(messages);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}

export default ContactController;
