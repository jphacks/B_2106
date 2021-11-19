module.exports = class Config {
  constructor(score, mode, playerNames) {
    this.score = score;
    this.mode = mode;
    this.maxKyoku = { 東風戦: 2, 半荘戦: 8 }[mode];
    this.playerNames = playerNames;
  }
};
