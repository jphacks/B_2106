module.exports = class Room {
  constructor(takuID) {
    this.takuID = takuID;
    this.players = [];
  }
  //   引数として{name: "??", id: "???"}を想定
  set player(user) {
    console.log("player");
    if (this.players.length > 3) {
      throw new Error("4 players already joined");
    }
    this.players.push(user);
  }
  leavePlayer(playerID) {
    console.log("leavePlayers");
    this.players = this.players.filter((p) => {
      return p.id !== playerID;
    });
  }
};