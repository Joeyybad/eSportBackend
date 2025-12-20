import Contact from "../domain/Contact.js";

class ContactService {
  // Injection du Repository
  constructor(contactRepository) {
    this.contactRepository = contactRepository;
  }

  async create(data) {
    const row = await this.contactRepository.create(data);
    return new Contact(row.toJSON());
  }

  async getAll() {
    // Appel au repo
    const rows = await this.contactRepository.findAll();

    // Mapping vers le domaine
    return rows.map((r) => {
      const json = r.toJSON();
      return new Contact({
        ...json,
        // Gestion sécurisée de l'objet user imbriqué
        user: json.User ? json.User : null,
      });
    });
  }

  async deleteMessage(id) {
    return await this.contactRepository.delete(id);
  }
}

export default ContactService;
