const calcSyanten = require("./syanten");
module.exports = class Field {
  constructor() {
    let all = [
      "1m",
      "2m",
      "3m",
      "4m",
      "5m",
      "6m",
      "7m",
      "8m",
      "9m",
      "1s",
      "2s",
      "3s",
      "4s",
      "5s",
      "6s",
      "7s",
      "8s",
      "9s",
      "1p",
      "2p",
      "3p",
      "4p",
      "5p",
      "6p",
      "7p",
      "8p",
      "9p",
      "1z",
      "2z",
      "3z",
      "4z",
      "5z",
      "6z",
      "7z",
    ];
    const shuffle = ([...array]) => {
      for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
    all = shuffle(all.concat(all).concat(all).concat(all));
    this.yama = all.slice(14, 136);
    this.wanpai = all.slice(0, 14);
    this.dora = [this.wanpai[0]];
    this.playerField = [];
    for (let i = 0; i < 4; i++) {
      this.playerField.push({
        tehai: [],
        tsumo: undefined,
        furo: [],
        kawa: [],
        flag: {
          riichi: false,
          ippatsu: false,
        },
      });
    }

    this.isFinished = false;
    this.prevSutehai = "dummy";
  }
  pop() {
    if (this.isFinished) throw "もう山無いよ";
    const tsumo = this.yama.pop();
    if (this.yama.length == 0) this.isFinished = true;
    return tsumo;
  }
  tsumo(player) {
    const tsumo = this.pop();
    this.playerField[player].tsumo = tsumo;
    return tsumo;
  }

  haipai() {
    for (let i = 0; i < 13; i++) {
      for (let j = 0; j < 4; j++)
        //四麻想定
        this.playerField[j].tehai.push(this.pop());
    }
  }
  getPlayerTehai() {
    return this.playerTehai;
  }

  dahai(player, pai) {
    const tehai = this.playerField[player].tehai;
    const index = tehai.indexOf(pai);
    if (index == -1) throw "手牌に無い牌が指定されています:" + pai;
    const sutehai = tehai.splice(index, 1);
    this.playerField[player].kawa.push(sutehai[0]);
    tehai.push(this.playerField[player].tsumo);
    this.playerField[player].tsumo = undefined;
    this.prevSutehai = sutehai;
    return sutehai;
  }

  tsumogiri(player, pai) {
    const tsumo = this.playerField[player].tsumo;
    this.playerField[player].kawa.push(tsumo);
    this.playerField[player].tsumo = undefined;
    this.prevSutehai = tsumo;
    return tsumo;
  }

  isAgari() {
    return true;
  }
  canRon(player) {
    const syanten = calcSyanten(
      this.playerField[player].tehai,
      this.prevSutehai
    );
    return syanten == -1;
  }
  canRiichi(player) {
    const syanten = calcSyanten(
      this.playerField[player].tehai,
      this.playerField[player].tsumo
    );
    return syanten == 0 || syanten == -1;
  }
  canTsumoAgari(player) {
    const syanten = calcSyanten(
      this.playerField[player].tehai,
      this.playerField[player].tsumo
    );
    return syanten == -1;
  }
  syanten(player) {
    const syanten = calcSyanten(this.playerField[player].tehai);
    return syanten;
  }
  riichiPai(player) {
    const candidate = [
      ...this.playerField[player].tehai,
      this.playerField[player].tsumo,
    ];
    const riichable = [];
    for (let i = 0; i < candidate.length; i++) {
      const syanten = calcSyanten(
        ...candidate.slice(0, i),
        ...candidate.slice(i + 1, candidate.length)
      );
      if (syanten == 0 || syanten == -1) riichable.push(candidate[i]);
    }
    return riichable;
  }
};
