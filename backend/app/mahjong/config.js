module.exports = class Config {
  constructor(score = 25000, mode = "東風戦") {
    this.score = score;
    this.mode = mode;
    this.maxKyoku = { 東風戦: 4, 半荘戦: 8 }[mode];
  }
};
