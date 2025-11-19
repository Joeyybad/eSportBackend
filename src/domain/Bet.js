class Bet {
  constructor({
    id,
    userId,
    matchId,
    amount,
    prediction, // home / away / draw
    odds,
    status, // pending / won / lost
    createdAt,
    updatedAt,
    match = null, // association facultative
  }) {
    this.id = id;
    this.userId = userId;
    this.matchId = matchId;
    this.amount = amount;
    this.prediction = prediction;
    this.odds = odds;
    this.status = status;
    this.match = match;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  payout() {
    return this.status === "won" ? this.amount * this.odds : 0;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      matchId: this.matchId,
      amount: this.amount,
      prediction: this.prediction,
      odds: this.odds,
      status: this.status,
      payout: this.payout(),
      match: this.match,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default Bet;
