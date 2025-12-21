import { Contact as ContactModel, User } from "../models/index.js";

class ContactRepository {
  // Créer un message
  async create(data) {
    return await ContactModel.create(data);
  }

  // Récupérer tous les messages
  async findAll() {
    return await ContactModel.findAll({
      include: [
        {
          model: User,
          // recupération de ce dont on a besoin
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  // Supprimer un message
  async delete(id) {
    const message = await ContactModel.findByPk(id);
    if (!message) return false;
    await message.destroy();
    return true;
  }
}

export default ContactRepository;
