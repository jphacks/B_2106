module.exports = class State {
  stateEnum = {
    局開始前: 0,
    局開始: 1,
    配牌: 2,
    行動待ち: 3,
    開始: 4,
    打牌待ち: 5,
    行動送信: 6,
    ゲーム終了: 7,
  };
  constructor() {
    this.state = 0;
  }
  transiton(next) {
    //遷移先チェック入れるかどうか

    this.state = this.stateEnum[next];
  }
  getState() {
    return [
      "局開始前",
      "局開始",
      "配牌",
      "行動待ち",
      "開始",
      "打牌待ち",
      "行動送信",
      "ゲーム終了",
    ][this.state];
  }
};
