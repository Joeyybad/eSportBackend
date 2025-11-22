class Tournament {
  constructor({
    id,
    name,
    game,
    description,
    status,
    startDate,
    endDate,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.name = name;
    this.game = game;
    this.description = description;
    this.status = status;
    this.startDate = startDate;
    this.endDate = endDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      game: this.game,
      description: this.description,
      status: this.status,
      startDate: this.startDate,
      endDate: this.endDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
export default Tournament;
