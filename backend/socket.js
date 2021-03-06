const Room = require("./room");
const Game = require("./mahjong/mahjong");
const Config = require("./mahjong/config");

module.exports = (io, rooms) => {
  io.on("connection", function (socket) {
    console.log("connected");

    // room作成のAPI
    socket.on("create-room", () => {
      console.log("create-room");
      const roomID = Math.floor(Math.random() * 10000).toString();
      // 重複するIDの際はerrorを返す
      if (io.sockets.adapter.rooms.get(roomID)) {
        console.log("error: create-room", roomID, io.sockets.adapter.rooms);
        socket.emit("create-room-response", { error: "can't create roomID" });
        return;
      }
      let r = new Room(socket.id);
      rooms[roomID] = r;

      leaveAllRoom(socket);
      socket.join(roomID);
      socket.emit("create-room-response", { roomID: roomID });
    });

    // roomに入る際のAPI
    socket.on("enter-room", (req) => {
      console.log("enter-room");

      const roomID = req["roomID"].toString();
      if (!io.sockets.adapter.rooms.get(roomID)) {
        console.log("error: enter-room", io.sockets.adapter.rooms.get(roomID));
        socket.emit("enter-room-response", { error: "no such roomID" });
        return;
      }

      try {
        const r = rooms[roomID];
        const name = req.name;

        // すでに同名のplayerが参加しているかどうか
        if (r.existPlayerWithName(name)) {
          // gameがまだ始まっていないとき
          if (!rooms[roomID].game) {
            throw Error(
              "Same name player already join and game haven't started yet."
            );
          }

          const res = reconnectRoom(socket, roomID, name);
          console.log(res);
          socket.emit("reconnect-response", res);
          resendMessageToPlayer(
            roomID,
            r.getPlayerIndexWithPlayerID(socket.id)
          );
          return;
        }

        r.player = { name: name, id: socket.id };
      } catch (error) {
        console.log(error);
        socket.emit("enter-room-response", { error: error.message });
        return;
      }

      leaveAllRoom(socket);
      socket.join(roomID);

      io.in(roomID).emit("enter-room-response", {
        name: req["name"] || "no name",
        id: socket.id,
      });
    });

    function reconnectRoom(socket, roomID, name) {
      console.log("reconnect-room");

      try {
        const r = rooms[roomID];
        if (!r) {
          throw new Error("no such roomID");
        }
        r.setPlayerIDWithName(name, socket.id);
      } catch (error) {
        console.log(error);
        return { error: error.message };
      }

      leaveAllRoom(socket);
      socket.join(roomID);

      // ここにreconnectしたときのデータを入れる
      let game;
      try {
        game = getGame(roomID);
      } catch (error) {
        return { error: error.message };
      }

      let indexOfPlayer = 0;
      try {
        indexOfPlayer = r.getPlayerIndexWithPlayerID(socket.id);
      } catch (error) {
        console.log(error);
        return { error: error.message };
      }

      res = {
        id: socket.id,
        tehai: game.getTehaiWithPlayerIndex(indexOfPlayer),
        tsumo: game.getTsumoWithPlayerIndex(indexOfPlayer),
        kaze: game.getKaze(indexOfPlayer),
      };

      return res;
    }

    // 退出するとき用の_API
    socket.on("exit-room", (req) => {
      const roomID = req["roomID"].toString();
      console.log("exit-room:" + roomID + ":" + socket.id);
      socket.leave(roomID);
      rooms[roomID].leavePlayer(socket.id);
      io.in(roomID).emit("exit-room-response", {
        name: req["name"],
        id: socket.id,
      });
    });

    // gameを始める際のAPI
    socket.on("start-game", (req) => {
      console.log("start-game");
      console.log(req);
      console.log(socket.rooms);
      io.to(roomID(socket)).emit("start-game-response", {
        players: rooms[roomID(socket)].players.map((p) => p.name),
      });
      console.log("ゲームを開始");
      const playerNames = getPlayerNames(roomID(socket));
      const config = new Config(25000, "東風戦", playerNames);

      const r = rooms[roomID(socket)];
      r.game = new Game(config);
      console.log(socket.rooms);
      const game = getGame(roomID(socket));
      let arg;
      arg = game.kyokuStart(); //局開始
      sendMessage(roomID(socket), arg);
      arg = game.haipai(); //局開始の配牌
      sendMessage(roomID(socket), arg);
      arg = game.sendTurnStart(); //最初のツモを受け取って送信
      sendMessage(roomID(socket), arg);
    });

    socket.on("dahai", (req) => {
      console.log("dahai", req);
      socket.emit("dahai-response", req);
      const game = getGame(roomID(socket));
      game.nextActionDahai(req); //プレイヤーから受け取った打牌を反映
      arg = game.sendNextAction(); //次のプレイヤーが取れる行動を送信
      game.setRiichi(false); //リーチをキャンセル．sendnextActionでやったほうがよい
      sendMessage(roomID(socket), arg);
    });

    socket.on("tablet-riichi-pushed", (req) => {
      const game = getGame(roomID(socket));
      game.setRiichi(true); //リーチフラグにtrueをセット
    });

    socket.on("client-riichi", (req) => {
      const game = getGame(roomID(socket));
      game.setRiichi(true); //リーチフラグにtrueをセット
    });
    socket.on("tablet-tsumo", (req) => {
      const game = getGame(roomID(socket));
      let arg;
      game.nextActionFuro(req); //次のツモを引くことをセット
      if (game.getState() == "流局") {
        //ツモして牌がなければ流局へ
        arg = game.ryukyokuFinish(req);
        sendMessage(roomID(socket), arg);
      } else {
        arg = game.sendTurnStart(req); //ツモを引いて牌を送信
        sendMessage(roomID(socket), arg);
      }
    });
    socket.on("tsumoAgari", (req) => {
      const room = roomID(socket);
      console.log("roomID:" + room);
      const game = getGame(roomID(socket));
      const arg = game.agariFinish(req);
      sendMessage(room, arg);
    });

    socket.on("ron", (req) => {
      const room = roomID(socket);
      const game = getGame(roomID(socket));
      let pidx = -1;
      const r = rooms[room];
      r.players.map((p, index) => {
        if (p.id == socket.id) pidx = index;
      });
      req["player"] = pidx;
      const arg = game.agariFinish(req);

      sendMessage(room, arg);
    });

    socket.on("tablet-send-ok", (req) => {
      const game = getGame(roomID(socket));
      if (game.getState() == "局開始前") {
        arg = game.kyokuStart(); //局開始
        sendMessage(roomID(socket), arg);
        arg = game.haipai(); //局開始の配牌
        sendMessage(roomID(socket), arg);
        arg = game.sendTurnStart(); //最初のツモを受け取って送信
        sendMessage(roomID(socket), arg);
      } else if (game.getState() == "ゲーム終了") {
        arg = game.gameover(); //最初のツモを受け取って送信
        sendMessage(roomID(socket), arg);
      } else {
        throw new Error("不正な状態:" + game.getState());
      }
    });
    // debug用
    socket.on("debug-show", (req) => {
      console.log(room[req.roomID]);
    });

    socket.on("debug-send", (req) => {
      console.log("debug-send");
      const clients = {
        players: [
          {
            "end-point": "debug-send-response",
            arg: [0],
          },
          {
            "end-point": "debug-send-response",
            arg: [1],
          },
          {
            "end-point": "debug-send-response",
            arg: [2],
          },
          {
            "end-point": "debug-send-response",
            arg: [3],
          },
        ],
        tablet: {
          "end-point": "debug-send-response",
          arg: [1234],
        },
      };

      sendMessage(req["roomID"], clients);
    });
  });
  function getPlayerNames(roomID) {
    const names = [];

    r = rooms[roomID];
    r.players.forEach((p) => {
      names.push(p.name);
    });
    return names;
  }

  function getGame(roomID) {
    if (!rooms[roomID].game) throw "gameがundefined!!";
    return rooms[roomID].game;
  }

  function roomID(socket) {
    const id = Array.from(socket.rooms)[1];
    return id;
  }
  function resendMessageToPlayer(roomID, playerId) {
    const room = rooms[roomID];
    if (!room) {
      console.log("no such room");
      console.log(`room : ${room}`);
      return;
    }
    const players = room["prevMessage"]["players"];
    const player = players[playerId];
    io.to(room["players"][playerId]["id"]).emit(
      player["endpoint"],
      player["arg"]
    );
  }
  function sendMessage(roomID, clients) {
    console.log(JSON.stringify({ roomID, clients }, null, "\t"));
    const room = rooms[roomID];
    if (!room) {
      console.log("no such room");
      console.log(`room : ${room}`);
      return;
    }
    room["prevMessage"] = clients;
    const tablet = clients["tablet"];

    if (Array.isArray(tablet)) {
      tablet.forEach((t) => io.to(room.takuID).emit(t["endpoint"], t["arg"]));
    } else {
      io.to(room.takuID).emit(tablet["endpoint"], tablet["arg"]);
    }

    const players = clients["players"];
    for (let i = 0; i < Math.min(room["players"].length, players.length); i++) {
      const player = players[i];
      io.to(room["players"][i]["id"]).emit(player["endpoint"], player["arg"]);
    }
  }

  function leaveAllRoom(socket) {
    for (const room of socket.rooms) {
      if (socket.id == room) {
        continue;
      }
      socket.leave(room);
    }
  }
};
/*
const connect = () => {
  const clients = [];
  for (let i = 0; i < 4; i++) {
    var socket = io("http://localhost:8080", { transports: ["websocket"] });

    // roomに作成のrequest, response
    // socket.emit("create-room")
    // response = {roomID: "????"}
    socket.on("create-room-response", (res) => {
      console.log(res);
    });

    // roomに参加する際のrequest, response
    // socket.emit("enter-room", {"name":"murakami", "roomID":"????"})
    // response = {name: "murakami", id: ???} idは参加した人のID
    socket.on("enter-room-response", (res) => {
      console.log(res);
    });

    // gameを始める際のrequest
    // socket.emit("start-game", {})
    socket.on("start-game-response", (res) => {
      console.log(res);
    });

    socket.on("debug-send-response", (res) => {
      console.log(res);
    });
    socket.on("client-kyokustart", (res) => {
      console.log(res);
    });
    socket.on("client-haipai", (res) => {
      console.log(res);
    });
    socket.on("client-turnstart", (res) => {
      console.log(res);
    });

    clients.push(socket);
  }
  return clients;
};
const enterRoom = (id) => {
  clients.forEach((socket,index) => socket.emit("enter-room", { roomID: id ,name:["a","i","u","e"][index]}));
};

var clients = connect();
*/
