class Team {
  constructor({ id, name, logo, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.logo = logo;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      logo: this.logo,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default Team;
