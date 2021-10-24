const Config = require("./config.js");
console.log(Config);
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
    this.oya_player = 0;
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
      oya_player: this.oya_player,
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
  nextActionFuro(actions) {
    //行動待ちで行動を選択
    this.state.transiton("開始");
  }
  turnStart() {
    //ターンプレイヤーがツモ
    this.state.transiton("打牌待ち");
  }
  nextActionDahai(actions) {
    //ターンプレイヤーがツモ
    this.state.transiton("行動送信");
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
//console.log(game.turnStart());
//console.log(game.nextActionDahai());
//console.log(game.nextActionFuro());
