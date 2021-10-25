const syanten = require("syanten");
const extract = (arg) => {
  const haiList = [];
  for (let i = 0; i < arg.length; i++) {
    if (Array.isArray(arg[i])) {
      haiList.push(...arg[i]);
    } else {
      haiList.push(arg[i]);
    }
  }
  return haiList;
};

const convert = (haiList) => {
  const haiCount = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0], //萬子
    [0, 0, 0, 0, 0, 0, 0, 0, 0], //筒子
    [0, 0, 0, 0, 0, 0, 0, 0, 0], //索子
    [0, 0, 0, 0, 0, 0, 0], //字牌
  ];
  haiList.map((hai) => {
    let num = Number(hai.substring(0, 1));
    const haiType = { m: 0, p: 1, s: 2, z: 3 }[hai.substring(1, 2)];
    if (num == 0) num = 5;
    haiCount[haiType][num - 1]++;
  });
  return haiCount;
};
const calcSyanten = (...arg) => {
  let haiList = extract(arg);
  haiList = convert(haiList);
  return syanten(haiList);
};
/*
console.log(
  calcSyanten(
    [
      "1m",
      "1m",
      "1m",
      "1m",
      "3m",
      "4m",
      "5m",
      "6m",
      "7m",
      "8m",
      "2p",
      "3p",
      "3z",
    ],
    "2m"
  )
);
*/
module.exports = calcSyanten;
