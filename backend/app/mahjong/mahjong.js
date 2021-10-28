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
    this.riichi = false;
  }
  setRiichi(riichi) {
    this.riichi = riichi;
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

    const ret = { players: [], tablet: undefined };
    ret.tablet = {
      endpoint: "tablet-kyokustart",
      arg: {
        kyoku: this.kyokuCount,
        honba: this.honbaCount,
        player: [
          { score: 25000, name: "hoge" },
          { score: 25000, name: "hoge" },
          { score: 25000, name: "hoge" },
          { score: 25000, name: "hoge" },
        ],
        oya: this.oyaPlayer,
        dora: this.field.dora,
      },
    };
    for (let i = 0; i < 4; i++) {
      ret.players[i] = {
        endpoint: "client-kyokustart",
        arg: { oya: i == this.oyaPlayer },
      };
    }
    return ret;
  }

  haipai() {
    //配牌に遷移

    this.state.transiton("開始");

    this.field.haipai();

    const ret = { players: [], tablet: undefined };
    ret.tablet = {
      endpoint: "tablet-haipai",
      arg: {},
    };
    for (let i = 0; i < 4; i++) {
      ret.players[i] = {
        endpoint: "client-haipai",
        arg: { tehai: this.field.playerField[i].tehai },
      };
    }
    return ret;
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
    let riichiFlag = false;
    let tsumoAgariFlag = false;
    let dahaiFlag = false;
    let riichiPai = [];
    if (!this.field.playerField[this.turnPlayer].flag.riichi) {
      dahaiFlag = true;

      if (this.field.canRiichi(this.turnPlayer)) {
        riichiFlag = true;
        riichiPai = this.field.riichiPai(this.turnPlayer);
      }
    }

    if (this.field.canTsumoAgari(this.turnPlayer)) {
      tsumoagariFlag = true;
    }

    this.state.transiton("打牌待ち");

    const ret = { players: [], tablet: undefined };
    ret.tablet = {
      endpoint: "tablet-reset",
      arg: {},
    };
    for (let i = 0; i < 4; i++) {
      if (this.turnPlayer == i) {
        ret.players[i] = {
          endpoint: "client-turnstart",
          arg: {
            turnplayer: true,
            canTsumoagari: true,
            canRiichi: true,
            pai: tsumo,
          },
        };
      } else {
        ret.players[i] = {
          endpoint: "client-turnstart",
          arg: { turnplayer: false },
        };
      }
    }
    return ret;
  }

  nextActionDahai(response) {
    //ターンプレイヤーがツモしたあとの行動処理
    const riichi = this.riichi;
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

    const ret = { players: [], tablet: undefined };
    ret.tablet = {
      endpoint: "tablet-dahai",
      arg: {
        pai: this.field.prevSutehai,
        playerId: this.turnPlayer,
        isRiichi: this.riichi,
      },
    };
    for (let i = 0; i < 4; i++) {
      if (this.turnPlayer == i) {
        ret.players[i] = {
          endpoint: "client-nextAction",
          arg: { canRon: false },
        };
      } else {
        ret.players[i] = {
          endpoint: "client-nextAction",
          arg: { canRon: this.field.canRon(i) },
        };
      }
    }
    return ret;
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
    return this.kyokuFinish();
  }
  agariFinish() {
    return this.kyokuFinish();
  }
  kyokuFinish() {
    this.oyaPlayer = (this.oyaPlayer + 1) % 4; //四麻想定
    this.field = undefined;
    this.kyokuCount++;
    if (this.config.maxKyoku > this.kyokuCount)
      this.state.transiton("ゲーム終了");
    else this.state.transiton("局開始前");

    const ret = { players: [], tablet: undefined };
    ret.tablet = {
      endpoint: "tablet-end",
      arg: {
        player: [
          { score: 25000, name: "hoge" },
          { score: 25000, name: "hoge" },
          { score: 25000, name: "hoge" },
          { score: 25000, name: "hoge" },
        ],
      },
    };
    for (let i = 0; i < 4; i++) {
      ret.players[i] = {
        endpoint: "client-end",
        arg: {},
      };
    }
    return ret;
  }
}
module.exports = Game;
