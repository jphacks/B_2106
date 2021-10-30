const Config = require("./config");
const Field = require("./field");
const Player = require("./player");
const State = require("./state");

class Game {
  constructor(config) {
    console.log(config);
    this.playerList = [
      new Player(config.score, config.playerNames[0]),
      new Player(config.score, config.playerNames[1]),
      new Player(config.score, config.playerNames[2]),
      new Player(config.score, config.playerNames[3]),
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
        arg: { kaze: (i - this.oyaPlayer + 4) % 4 },
      };
    }
    return ret;
  }

  haipai() {
    //配牌に遷移

    this.state.transiton("開始");

    this.field.haipai();

    // this.field.playerField[0].tehai = [
    //   "1m",
    //   "1m",
    //   "1m",
    //   "2m",
    //   "3m",
    //   "4m",
    //   "5m",
    //   "6m",
    //   "7m",
    //   "8m",
    //   "9m",
    //   "9m",
    //   "9m",
    // ];

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
    let tsumo = this.field.tsumo(this.turnPlayer);
    //デバッグ
    // tsumo = this.field.playerField[this.turnPlayer].tsumo = "1m";
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
      tsumoAgariFlag = true;
    }

    this.state.transiton("打牌待ち");

    const ret = { players: [], tablet: undefined };
    ret.tablet = [
      {
        endpoint: "tablet-reset",
        arg: {},
      },
    ];
    if (riichiFlag)
      ret.tablet.push({
        endpoint: "tablet-riichi",
        arg: { playerId: this.turnPlayer },
      });
    for (let i = 0; i < 4; i++) {
      if (this.turnPlayer == i) {
        ret.players[i] = {
          endpoint: "client-turnstart",
          arg: {
            turnplayer: true,
            canTsumoagari: tsumoAgariFlag,
            canRiichi: true,
            canDahai: dahaiFlag,
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
    const ret = { players: [], tablet: undefined };
    ret.tablet = [
      {
        endpoint: "tablet-dahai",
        arg: {
          pai: this.field.prevSutehai,
          playerId: this.turnPlayer,
          isRiichi: this.riichi,
        },
      },
      {
        endpoint: "tablet-tsumo",
        arg: { actions: "tsumo", turnPlayer: (this.turnPlayer + 1) % 4 },
      },
    ];
    for (let i = 0; i < 4; i++) {
      if (this.turnPlayer == i) {
        ret.players[i] = {
          endpoint: "client-nextaction",
          arg: { canRon: false },
        };
      } else {
        ret.players[i] = {
          endpoint: "client-nextaction",
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
      if (this.field.isFinished) {
        this.state.transiton("流局");
      } else {
        this.turnPlayer = (this.turnPlayer + 1) % 4; //四麻想定
        this.state.transiton("開始");
      }
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
