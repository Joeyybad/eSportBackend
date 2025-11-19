class Contact {
  constructor({
    id,
    name,
    email,
    sujet,
    message,
    userId,
    createdAt,
    updatedAt,
    user = null,
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.sujet = sujet;
    this.message = message;
    this.userId = userId;
    this.user = user;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      sujet: this.sujet,
      message: this.message,
      userId: this.userId,
      user: this.user,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default Contact;
