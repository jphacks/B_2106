const Config = require("./config");
const Field = require("./field");
const Player = require("./player");
const State = require("./state");
const calclate = require("./calclator");
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
    this.senten = 0;
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
    this.turnPlayer = this.oyaPlayer;
    const ret = { players: [], tablet: undefined };
    console.log(this.playerList);
    ret.tablet = {
      endpoint: "tablet-kyokustart",
      arg: {
        kyoku: this.kyokuCount,
        honba: this.honbaCount,
        player: [
          { score: this.playerList[0].score, name: "hoge" },
          { score: this.playerList[1].score, name: "hoge" },
          { score: this.playerList[2].score, name: "hoge" },
          { score: this.playerList[3].score, name: "hoge" },
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
    //this.field.yama = ["1m"];
    this.field.playerField[0].tehai = [
      "1m",
      "1m",
      "1m",
      "2m",
      "3m",
      "4m",
      "5m",
      "6m",
      "7m",
      "8m",
      "9m",
      "9m",
      "9m",
    ];

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
      {
        endpoint: "tablet-yama",
        arg: {
          length: this.field.yama.length,
        },
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
      //一発消し
      this.field.playerField[this.turnPlayer].flag.ippatsu = false;
      this.state.transiton("行動送信");
    } else if (response.action == "tsumogiri") {
      this.field.tsumogiri(this.turnPlayer, response.pai);
      this.state.transiton("行動送信");
    } else if (response.action == "tsumoAgari") {
      this.state.transiton("点数計算");
    } else {
      throw "不正なaction!:" + response.action;
    }
    if (riichi) {
      if (this.field.canRiichi(this.turnPlayer)) {
        this.field.playerField[this.turnPlayer].flag.riichi = true;
        this.field.playerField[this.turnPlayer].flag.ippatsu = true;
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
    const ret = { players: [], tablet: undefined };
    let score = this.playerList.map((p, index) => p.score);
    const syanten = this.playerList.map((p, index) =>
      this.field.syanten(index)
    );
    const tenpaiCount = syanten.filter(function (x) {
      return x === 0;
    }).length;
    let diff = [];
    if (tenpaiCount == 0 || tenpaiCount == 4) {
      diff = [0, 0, 0, 0];
    } else {
      const win = 3000 / tenpaiCount;
      const lose = -(3000 / (4 - tenpaiCount));
      diff = syanten.map((s) => (s == 0 ? win : lose));
    }
    score = score.map((s, index) => s + diff[index]);
    this.playerList.map((player, index) => {
      player.score = score[index];
    });
    ret.tablet = {
      endpoint: "tablet-ryukyoku",
      arg: { score, diff },
    };
    for (let i = 0; i < 4; i++) {
      ret.players[i] = {
        endpoint: "client-ryukyoku",
        arg: {},
      };
    }
    this.kyokuFinish();
    return ret;
  }
  agariFinish(req) {
    if (req.action == "tsumoAgari") {
      const player = [null, null, null, null];
      player[this.turnPlayer] = "ツモ";
      const option =
        (this.field.playerField[this.turnPlayer].flag.riichi ? "r" : "") +
        (this.field.playerField[this.turnPlayer].flag.ippatsu ? "i" : "");
      const score = this.playerList.map((p) => p.score);
      const dora = this.field.dora;
      const uradora = [];
      if (this.field.playerField[this.turnPlayer].flag.riichi) {
        //裏ドラ
        for (let i = 0; i < dora.length; i++)
          uradora.push(this.field.wanpai.pop());
      }
      const tabletArg = calclate(
        this.field.playerField[this.turnPlayer].tehai,
        this.field.playerField[this.turnPlayer].tsumo,
        player,
        this.oyaPlayer,
        option,
        score,
        dora,
        uradora
      );
      tabletArg.score.map((s, index) => (this.playerList[index].score = s));
      this.kyokuFinish();
      const ret = { players: [], tablet: undefined };
      ret.tablet = {
        endpoint: "tablet-agari",
        arg: tabletArg,
      };
      for (let i = 0; i < 4; i++) {
        ret.players[i] = {
          endpoint: "client-agari",
          arg: {},
        };
      }
      return ret;
    } else if (req.action == "ron") {
      const player = [null, null, null, null];
      player[req.player] = "ロン";
      player[this.turnPlayer] = "放銃";
      const option =
        (this.field.playerField[req.player].flag.riichi ? "r" : "") +
        (this.field.playerField[req.player].flag.ippatsu ? "i" : "");
      const score = this.playerList.map((p) => p.score);
      const dora = this.field.dora;
      const uradora = [];
      if (this.field.playerField[req.player].flag.riichi) {
        //裏ドラ
        for (let i = 0; i < dora.length; i++)
          uradora.push(this.field.wanpai.pop());
      }
      const tabletArg = calclate(
        this.field.playerField[req.player].tehai,
        this.field.prevSutehai,
        player,
        this.oyaPlayer,
        option,
        score,
        dora,
        uradora
      );
      tabletArg.score.map((s, index) => (this.playerList[index].score = s));
      this.kyokuFinish();
      const ret = { players: [], tablet: undefined };
      ret.tablet = {
        endpoint: "tablet-agari",
        arg: tabletArg,
      };
      for (let i = 0; i < 4; i++) {
        ret.players[i] = {
          endpoint: "client-agari",
          arg: {},
        };
      }
      return ret;
    }
  }
  kyokuFinish() {
    this.oyaPlayer = (this.oyaPlayer + 1) % 4; //四麻想定
    this.field = undefined;
    this.kyokuCount++;
    if (
      this.config.maxKyoku < this.kyokuCount ||
      this.playerList.filter((p) => p.score < 0).length > 0
    )
      this.state.transiton("ゲーム終了");
    else this.state.transiton("局開始前");
  }
  gameover() {
    const ret = { players: [], tablet: undefined };
    const ranking = this.playerList.map((p) => {
      return { score: p.score, name: p.name };
    });
    ranking.sort((a, b) => b.score - a.score);
    ret.tablet = {
      endpoint: "tablet-gameover",
      arg: {
        ranking,
      },
    };
    for (let i = 0; i < 4; i++) {
      ret.players[i] = {
        endpoint: "client-gameover",
        arg: {},
      };
    }
    return ret;
  }
}
module.exports = Game;
