const Riichi = require("riichi");

const convertList = (haiList) => {
  manzu = haiList.filter((hai) => hai.charAt(1) == "m").sort();
  pinzu = haiList.filter((hai) => hai.charAt(1) == "p").sort();
  sozu = haiList.filter((hai) => hai.charAt(1) == "s").sort();
  jihai = haiList.filter((hai) => hai.charAt(1) == "z").sort();
  let ret = "";
  if (manzu.length > 0) ret += manzu.map((hai) => hai.charAt(0)).join("") + "m";
  if (pinzu.length > 0) ret += pinzu.map((hai) => hai.charAt(0)).join("") + "p";
  if (sozu.length > 0) ret += sozu.map((hai) => hai.charAt(0)).join("") + "s";
  if (jihai.length > 0) ret += jihai.map((hai) => hai.charAt(0)).join("") + "z";
  return ret;
};
const convert = (haiList, alpha, isTsumo, option, dora) => {
  let ret = "";
  ret += convertList(haiList);
  ret += (isTsumo ? "" : "+") + alpha;
  if (option) ret += "+" + option;
  ret += "+d" + convertList(dora);
  return ret;
};
const exec = (obj, oyaPlayer, player, scoreOrg, dora, uradora, senten) => {
  const isOya =
    Math.max(player.indexOf("ロン"), player.indexOf("ツモ")) == oyaPlayer;
  score = isOya ? obj.oya : obj.ko;
  ten = score.reduce((sum, element) => sum + element, 0);
  let diff = [];
  if (player.includes("ツモ")) {
    diff = player.map((item, index) => {
      if (item == null) {
        if (index == oyaPlayer) return -score[0];
        else return -score[1];
      }
      return ten + senten * 1000;
    });
  } else {
    diff = player.map((item) =>
      "ロン" == item ? ten + senten * 1000 : "放銃" == item ? -ten : 0
    );
  }
  scoreOrg = scoreOrg.map((i, index) => i + diff[index]);
  const details = obj.yakuman == 0 ? obj.fu + "符" + obj.han + "翻" : "";
  const ret = {
    yaku: obj.yaku,
    details,
    ten,
    diff,
    score: scoreOrg,
    dora,
    uradora,
    name: obj.name,
  };
  return ret;
};
const calclate = (
  haiList,
  alpha,
  player,
  oyaPlayer,
  option,
  score,
  dora,
  uradora,
  senten
) => {
  const tehai = convert(
    haiList,
    alpha,
    player.includes("ツモ"),
    option,
    dora.concat(uradora)
  );
  const riichi = new Riichi(tehai);
  const ret = riichi.calc();
  console.log(ret);
  return exec(ret, oyaPlayer, player, score, dora, uradora, senten);
};

module.exports = calclate;
/*
//test
player = ["ツモ", null, null, null];
list = [
  "1m",
  "1m",
  "1m",
  "2m",
  "2m",
  "2m",
  "3m",
  "3m",
  "4p",
  "5p",
  "6p",
  "8s",
  "9s",
];
console.log(
  calclate(
    list,
    "7s",
    player,
    1,
    "ri",
    [25000, 25000, 25000, 25000],
    ["1m"],
    [],
    0
  )
);
*/
