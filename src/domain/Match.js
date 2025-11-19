class Match {
  constructor({
    id,
    homeTeamId,
    awayTeamId,
    homeTeam,
    awayTeam,
    oddsHome,
    oddsAway,
    oddsDraw,
    date,
    status,
    result,
    event,
    phase,
    tournamentId,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.homeTeamId = homeTeamId;
    this.awayTeamId = awayTeamId;

    // Associations (optionnelles selon include)
    this.homeTeam = homeTeam || null;
    this.awayTeam = awayTeam || null;

    this.oddsHome = oddsHome;
    this.oddsAway = oddsAway;
    this.oddsDraw = oddsDraw;

    this.date = date;
    this.status = status;
    this.result = result;

    this.event = event;
    this.phase = phase;
    this.tournamentId = tournamentId;

    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /** Détermine si un match est “serré” */
  isTight() {
    const probs = this._probabilities();
    return probs.home >= 0.45 && probs.home <= 0.55;
  }

  /** Retourne les probabilités calculées à partir des cotes */
  _probabilities() {
    const total = 1 / this.oddsHome + 1 / this.oddsAway + 1 / this.oddsDraw;
    return {
      home: 1 / this.oddsHome / total,
      away: 1 / this.oddsAway / total,
      draw: 1 / this.oddsDraw / total,
    };
  }

  /** Un match est jouable si pas encore terminé */
  isOpenForBetting() {
    return (
      this.status === "scheduled" ||
      this.status === "live" ||
      this.status === "completed" ||
      this.status === "cancelled"
    );
  }

  /** Formatage propre pour API frontend */
  toJSON() {
    return {
      id: this.id,
      homeTeamId: this.homeTeamId,
      awayTeamId: this.awayTeamId,
      homeTeam: this.homeTeam,
      awayTeam: this.awayTeam,
      oddsHome: this.oddsHome,
      oddsAway: this.oddsAway,
      oddsDraw: this.oddsDraw,
      date: this.date,
      status: this.status,
      result: this.result,
      event: this.event,
      phase: this.phase,
      tournamentId: this.tournamentId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default Match;
