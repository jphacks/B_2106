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
    const turnPlayersAction = this.makeAction(["tsumogiri"]);

    if (!this.field.playerField[this.turnPlayer].flag.riichi) {
      turnPlayersAction.actions.push("dahai");

      if (this.field.canRiichi(this.turnPlayer)) {
        turnPlayersAction.actions.push("riichi");
        turnPlayersAction["riichiPai"] = this.field.riichiPai(this.turnPlayer);
        tablet.actions.push("riichi");
      }
    }

    if (this.field.canTsumoAgari(this.turnPlayer)) {
      turnPlayersAction.actions.push("tsumoagari");
    }

    players[this.turnPlayer] = turnPlayersAction;

    this.state.transiton("打牌待ち");

    return {
      turnPlayer: this.turnPlayer,
      players,
      tablet,
    };
  }

  nextActionDahai(response, riichi = false) {
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
    if (riichi) {
      if (this.field.canRiichi(this.turnPlayer)) {
        this.field.playerField[this.turnPlayer].flag.riichi = true;
      }
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
    if (this.field.isFinished) {
      //流局処理に遷移
      //ロンがなければ，kyokufinish()
      if (ronFlag) {
        tablet.actions.push("ryukyoku");
        this.state.transiton("行動待ち");
      } else this.state.transiton("流局");
    } else {
      tablet.actions.push(["tsumo"]);
      this.state.transiton("行動待ち");
    }
    tablet["sutehai"] = {
      turnPlayer: this.turnPlayer,
      pai: this.field.prevSutehai,
    };
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
    this.kyokuFinish();
  }
  agariFinish() {
    this.kyokuFinish();
  }
  kyokuFinish() {
    this.oyaPlayer = (this.oyaPlayer + 1) % 4; //四麻想定
    this.field = undefined;
    this.kyokuCount++;
    if (this.config.maxKyoku > this.kyokuCount)
      this.state.transiton("ゲーム終了");
    else this.state.transiton("局開始前");
  }
}
module.exports = Game;
