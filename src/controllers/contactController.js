class ContactController {
  constructor(contactService) {
    this.service = contactService;
  }
  // Créer un nouveau message de contact
  createContactMessage = async (req, res) => {
    try {
      const { name, email, sujet, message } = req.body;

      const newMessage = await this.service.create({
        name,
        email,
        sujet,
        message,
      });
      res.status(201).json(newMessage);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };
}

export default ContactController;
