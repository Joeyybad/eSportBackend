class ContactController {
  constructor(contactService) {
    this.service = contactService;
  }

  // Créer un nouveau message de contact
  createContactMessage = async (req, res, next) => {
    try {
      const { name, email, sujet, message } = req.body;

      const userId = req.user ? req.user.id : null;

      const newMessage = await this.service.create({
        userId,
        name,
        email,
        sujet,
        message,
      });

      res.status(201).json(newMessage);
    } catch (err) {
      next(err);
    }
  };

  // (Optionnel) Pour l'admin : Voir les messages
  getAllMessages = async (req, res, next) => {
    try {
      const messages = await this.service.getAll();
      res.json(messages);
    } catch (err) {
      next(err);
    }
  };
}

export default ContactController;
