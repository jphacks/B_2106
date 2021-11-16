module.exports = class Room {
  constructor(takuID) {
    this.takuID = takuID;
    this.players = [];
  }

  //   引数として{name: "??", id: "???"}を想定
  set player(user) {
    if (this.players.length > 3) {
      throw new Error("4 players already joined");
    }

    for (const player of this.players) {
      if (player.name === user.name) {
        throw new Error("same name player already enter room");
      }
    }

    this.players.push(user);
  }

  leavePlayer(playerID) {
    console.log("leavePlayers");
    this.players = this.players.filter((p) => {
      return p.id !== playerID;
    });
  }

  // nameが一致したplayerのplayerIDを書き換える
  setPlayerIDWithName(name, playerID) {
    for (const player of this.players) {
      if (player.name === name) {
        player.id = playerID;
        return;
      }
    }
    throw new Error("no such player name");
  }

  getPlayerIndexWithPlayerID(playerID) {
    for (let i = 0; i < this.players.length; i++) {
      if (playerID == this.players[i].id) {
        return i;
      }
    }
    throw new Error("cannot find player index");
  }

  existPlayerWithName(name) {
    for (const player of this.players) {
      if (player.name == name) {
        return true;
      }
    }
    return false;
  }
};
