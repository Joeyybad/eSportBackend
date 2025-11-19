import { Contact as ContactModel, User } from "../models/index.js";
import Contact from "../domain/Contact.js";

class ContactService {
  async create(data) {
    const row = await ContactModel.create(data);
    return new Contact(row.toJSON());
  }

  async getAll() {
    const rows = await ContactModel.findAll({ include: [User] });

    return rows.map(
      (r) =>
        new Contact({
          ...r.toJSON(),
          user: r.user ? r.user.toJSON() : null,
        })
    );
  }
}
export default new ContactService();
