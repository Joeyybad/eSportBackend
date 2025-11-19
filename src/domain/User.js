class User {
  constructor({ id, username, email, role, createdAt, updatedAt }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.role = role;
    this.avatar = avatar;
    this.favoritesGames = favoritesGames;
    this.favoritesTeams = favoritesTeams;
    this.birthdate = birthdate;
    this.password = password;
    this.isConditionChecked = isConditionChecked;
    this.betsWon = betsWon;
    this.betsTotal = betsTotal;
    this.totalEarnings = totalEarnings;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isAdmin() {
    return this.role === "admin";
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role,
      avatar: this.avatar,
      favoritesGames: this.favoritesGames,
      favoritesTeams: this.favoritesTeams,
      birthdate: this.birthdate,
      password: this.password,
      isConditionChecked: this.isConditionChecked,
      betsWon: this.betsWon,
      betsTotal: this.betsTotal,
      totalEarnings: this.totalEarnings,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default User;
