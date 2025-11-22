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
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
    res.status(201).json(newMessage);
  };
}

export default ContactController;
