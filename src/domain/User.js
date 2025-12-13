class User {
  constructor({
    id,
    username,
    email,
    role,
    createdAt,
    updatedAt,
    avatar,
    favoritesGames,
    favoritesTeams,
    birthdate,
    password,
    isConditionChecked,
    betsWon,
    betsTotal,
    totalEarnings,
    Bets,
  }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.role = role;

    this.avatar = avatar || "";
    this.favoritesGames = favoritesGames || [];
    this.favoritesTeams = favoritesTeams || [];
    this.birthdate = birthdate;
    this.password = password;
    this.isConditionChecked = isConditionChecked;
    this.betsWon = betsWon || 0;
    this.betsTotal = betsTotal || 0;
    this.totalEarnings = totalEarnings || 0;

    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.Bets = Bets || [];
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
      // password: this.password, // Sécurité : on ne renvoie jamais le MDP
      isConditionChecked: this.isConditionChecked,
      betsWon: this.betsWon,
      betsTotal: this.betsTotal,
      totalEarnings: this.totalEarnings,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      Bets: this.Bets,
    };
  }
}

export default User;
