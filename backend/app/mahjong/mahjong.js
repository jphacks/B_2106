const Config = require("./config");
const Field = require("./field");
const Player = require("./player");
const State = require("./state");

class Game {
  constructor(config = new Config()) {
    this.playerList = [
      new Player(config.score),
      new Player(config.score),
      new Player(config.score),
      new Player(config.score),
    ];
    this.kyokuCount = 1;
    this.honbaCount = 1;
    this.isFinished = false;
    this.config = config;
    this.state = new State();
    this.oyaPlayer = 0;
    this.turnPlayer = this.oyaPlayer;
  }

  isFinished() {
    return this.isFinished;
  }
  getState() {
    return this.state.getState();
  }

  kyokuStart() {
    //局開始に遷移
    this.state.transiton("配牌");
    this.field = new Field();
    return {
      oyaPlayer: this.oyaPlayer,
      kyoku: this.kyokuCount,
      honba: this.honbaCount,
    };
  }
  haipai() {
    //配牌に遷移
    this.state.transiton("開始");
    this.field.haipai();
    return {
      pai: this.field.getPlayerTehai(),
    };
  }
  nextActionFuro(action) {
    //行動待ちで行動を選択
    this.state.transiton("開始");
  }
  turnStart() {
    //ターンプレイヤーがツモ
    const tsumo = this.field.tsumo(this.turnPlayer);
    //ここにリーチ判定とツモ和了り判定が必要
    this.state.transiton("打牌待ち");
    return {
      turnPlayer: this.turnPlayer,
      playersField: this.field.playerField,
      riichiHai: [],
      canTsumo: false,
    };
  }
  nextActionDahai(response) {
    //ターンプレイヤーがツモしたあとの行動処理
    if (response.action == "dahai") {
      this.field.dahai(this.turnPlayer, response.pai);
      this.state.transiton("行動送信");
    } else if (response.action == "tsumogiri") {
      this.field.tsumogiri(this.turnPlayer, response.pai);
      this.state.transiton("行動送信");
    } else if (response.action == "tsumoagari") {
      this.state.transiton("点数計算");
    } else {
      throw "不正なaction!:" + response.action;
    }
  }
  kyokuFinish() {
    //点数計算
    this.state.transiton("局開始前");
  }
}

game = new Game();

console.log(game);
console.log(game.kyokuStart());

console.log(game);

console.log(game.haipai());

console.log(game.turnStart());
console.log(game.field.playerField);
console.log(
  game.nextActionDahai({
    action: "dahai",
    pai: "1m",
  })
);
console.log(game.field.playerField);
console.log(game.nextActionFuro());
