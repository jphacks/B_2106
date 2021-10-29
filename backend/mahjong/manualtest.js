const Game = require("./mahjong");
game = new Game();

//game test;
console.log(game.kyokuStart());
console.log(game.haipai());

game.field.playerField[0].tehai = [
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
  const { players, tablet } = game.sendTurnStart();
  console.log(tablet, tablet.actions.indexOf("riichi"), players[0], players[1]);
  if (tablet.actions.indexOf("riichi") >= 0) {
    game.nextActionDahai(
      {
        action: "tsumogiri",
        pai: "?",
      },
      true
    );
  } else if (players[0].actions.indexOf("tsumoagari") >= 0) {
    game.nextActionDahai(
      {
        action: "tsumoagari",
        pai: "?",
      },
      false
    );
  }
  //console.log(
  else
    game.nextActionDahai({
      action: "tsumogiri",
      pai: "?",
    });
  //);

  //console.log(
  console.log(
    game.field.prevSutehai,
    "->",
    game.sendNextAction()["players"][0]
  );

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
