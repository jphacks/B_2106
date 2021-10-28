/** @format */

const Room = require('./room');

module.exports = (io, rooms) => {
  io.on('connection', function (socket) {
    console.log('connected');

    // room作成のAPI
    socket.on('create-room', () => {
      console.log('create-room');
      const roomID = Math.floor(Math.random() * 10000).toString();

      // 重複するIDの際はerrorを返す
      if (io.sockets.adapter.rooms.get(roomID)) {
        console.log('error: create-room', roomID, io.sockets.adapter.rooms);
        socket.emit('create-room-response', { error: "can't create roomID" });
        return;
      }

      let r = new Room(socket.id);
      rooms[roomID] = r;

      socket.join(roomID);
      socket.emit('create-room-response', { roomID: roomID });
    });

    // roomに入る際のAPI
    socket.on('enter-room', (req) => {
      console.log('enter-room');

      const roomID = req['roomID'].toString();
      if (!io.sockets.adapter.rooms.get(roomID)) {
        console.log('error: enter-room', io.sockets.adapter.rooms.get(roomID));
        socket.emit('enter-room-response', { error: 'no such roomID' });
        return;
      }

      try {
        const name = req.name;
        const r = rooms[req.roomID];
        r.player = { name: name, id: socket.id };
      } catch (error) {
        console.log(error);
        socket.emit('enter-room-response', { error: error.message });
        return;
      }

      socket.join(roomID);

      io.in(roomID).emit('enter-room-response', {
        name: req['name'] || 'no name',
        id: socket.id,
      });
    });

    // 退出するとき用の_API
    socket.on('exit-room', (req) => {
      console.log('exit-room:' + req['roomID'] + ':' + req['id']);
      socket.leave(req['roomID']);
      rooms[req['roomID']].leavePlayer(req['id']);
      io.in(req['roomID']).emit('exit-room-response', {
        name: req['name'],
        id: socket.id,
      });
    });

    // gameを始める際のAPI
    socket.on('start-game', (req) => {
      console.log('start-game');
      console.log(req);
      socket.emit('start-game-response', req);
    });

    socket.on('dahai', (req) => {
      socket.emit('dahai-response', req);
    });

    socket.on('ron', (req) => {});

    socket.on('riichi', (req) => {});

    socket.on('tsumo', (req) => {});

    // debug用
    socket.on('debug-show', (req) => {
      console.log(room[req.roomID]);
    });

    socket.on('debug-send', (req) => {
      console.log('debug-send');
      const clients = {
        players: [
          {
            'end-point': 'debug-send-response',
            arg: [0],
          },
          {
            'end-point': 'debug-send-response',
            arg: [1],
          },
          {
            'end-point': 'debug-send-response',
            arg: [2],
          },
          {
            'end-point': 'debug-send-response',
            arg: [3],
          },
        ],
        tablet: {
          'end-point': 'debug-send-response',
          arg: [1234],
        },
      };

      sendMessage(req['roomID'], clients);
    });
  });

  function sendMessage(roomID, clients) {
    const room = rooms[roomID];
    console.log(rooms);
    if (!room) {
      console.log('no such room');
      console.log(`room : ${room}`);
      return;
    }

    const tablet = clients['tablet'];
    io.to(room.takuID).emit(tablet['end-point'], tablet['arg']);

    const players = clients['players'];
    for (let i = 0; i < Math.min(room['players'].length, players.length); i++) {
      const player = players[i];
      io.to(room['players'][i]['id']).emit(player['end-point'], player['arg']);
    }
  }
};
