class Team {
  constructor({ id, teamName, game, description, logo, createdAt, updatedAt }) {
    this.id = id;
    this.teamName = teamName;
    this.game = game;
    this.description = description;
    this.logo = logo;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      teamName: this.teamName,
      game: this.game,
      logo: this.logo,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default Team;
