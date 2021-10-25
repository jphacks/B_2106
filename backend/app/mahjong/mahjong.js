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
  makeAction(actions = []) {
    return {
      actions,
    };
  }
  sendTurnStart() {
    //ターンプレイヤーがツモ
    const tsumo = this.field.tsumo(this.turnPlayer);

    //各プレイヤーが取れる行動リスト

    const players = [
      this.makeAction(["pass"]),
      this.makeAction(["pass"]),
      this.makeAction(["pass"]),
      this.makeAction(["pass"]),
    ];

    const tablet = this.makeAction(["pass"]);
    const turnPlayersAction = this.makeAction(["dahai"]);

    if (this.field.canRiichi(this.turnPlayer)) {
      turnPlayersAction.action.push("riichi");
      turnPlayersActions["riichiPai"] = riichiPai(turnPlayer);
      tablet.action.push("riichi");
    }
    if (this.field.canTsumoAgari(this.turnPlayer)) {
      turnPlayersAction.action.push("tsumoAgari");
    }

    players[this.turnPlayer] = turnPlayersAction;

    this.state.transiton("打牌待ち");

    return {
      turnPlayer: this.turnPlayer,
      players,
      tablet,
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
  sendNextAction() {
    const players = [
      this.makeAction(),
      this.makeAction(),
      this.makeAction(),
      this.makeAction(),
    ];
    //ロンができるか判定して"ron"を加える
    let ronFlag = false;
    for (let i = 0; i < 4; i++) {
      if (this.turnPlayer == i) continue;
      if (this.field.canRon(i)) {
        players[i].actions.push("ron");
        ronFlag = true;
      }
    }

    const tablet = this.makeAction();
    console.log(this.field.isFinished + " " + ronFlag);
    if (this.field.isFinished) {
      //流局処理に遷移
      //ロンがなければ，kyokufinish()
      if (ronFlag) {
        tablet.actions.push("ryukyoku");
        this.state.transiton("行動待ち");
      } else this.state.transiton("流局");
    } else {
      const tablet = this.makeAction(["tsumo"]);
      this.state.transiton("行動待ち");
    }

    return {
      turnPlayer: this.turnPlayer,
      players,
      tablet,
    };
  }
  nextActionFuro(response) {
    //行動待ちで行動を選択
    if (response.action == "ron") {
      this.state.transiton("点数計算");
    } else if (response.action == "tsumo") {
      this.turnPlayer = (this.turnPlayer + 1) % 4; //四麻想定
      this.state.transiton("開始");
    }
  }
  ryukyokuFinish() {
    //流局処理
    this.oyaPlayer = (this.oyaPlayer + 1) % 4; //四麻想定
    this.field = undefined;
    this.state.transiton("局開始前");
  }
}

game = new Game();

//game test;
console.log(game.kyokuStart());
console.log(game.haipai());
console.log(game.sendTurnStart());
console.log(
  game.nextActionDahai({
    action: "tsumogiri",
    pai: "?",
  })
);
console.log(game.field.playerField);
console.log(game.sendNextAction());
console.log(game.nextActionFuro({ action: "tsumo" }));

console.log(game.sendTurnStart());

console.log(game.field.playerField);
for (let i = 0; i < 130; i++) {
  //console.log(
  game.sendTurnStart();
  //);
  //console.log(
  game.nextActionDahai({
    action: "tsumogiri",
    pai: "?",
  });
  //);

  //console.log(
  game.sendNextAction();
  console.log(game.getState());
  if (game.getState() == "流局") {
    break;
  }
  //);
  //console.log(
  game.nextActionFuro({ action: "tsumo" });
  //);
}
console.log(game.field.playerField);

console.log(game.ryukyokuFinish());
console.log(game.kyokuStart());
console.log(game.haipai());
console.log(game.sendTurnStart());
console.log(
  game.nextActionDahai({
    action: "tsumogiri",
    pai: "?",
  })
);
console.log(game.field.playerField);
console.log(game.sendNextAction());
console.log(game.nextActionFuro({ action: "tsumo" }));

console.log(game.sendTurnStart());

console.log(game.field.playerField);
for (let i = 0; i < 130; i++) {
  //console.log(
  game.sendTurnStart();
  //);
  //console.log(
  game.nextActionDahai({
    action: "tsumogiri",
    pai: "?",
  });
  //);

  //console.log(
  game.sendNextAction();
  console.log(game.getState());
  if (game.getState() == "流局") {
    break;
  }
  //);
  //console.log(
  game.nextActionFuro({ action: "tsumo" });
  //);
}
console.log(game.field.playerField);

console.log(game.ryukyokuFinish());
