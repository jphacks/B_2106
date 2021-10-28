/** @format */

module.exports = (io) => {
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

      socket.join(roomID);
      socket.emit('create-room-response', { roomID: roomID });
    });

    // roomに入る際のAPI
    socket.on('enter-room', (req) => {
      console.log('enter-room:' + req['roomID']);

      const roomID = req['roomID'].toString();
      if (!io.sockets.adapter.rooms.get(roomID)) {
        console.log('error: enter-room', io.sockets.adapter.rooms.get(roomID));
        socket.emit('enter-room-response', { error: 'no such roomID' });
        return;
      }
      socket.join(roomID);

      io.in(roomID).emit('enter-room-response', {
        name: req['name'] || 'no name',
        id: socket.id, //userId
      });
    });

    // 退出するとき用の_API
    socket.on('exit-room', (req) => {
      console.log('exit-room:' + req['roomID'] + ':' + req['id']);
      socket.leave(req['roomID']);
      io.in(req['roomID']).emit('exit-room-response', {
        name: req['name'],
        id: socket.id,
      });
    });

    // gameを始める際のAPI
    socket.on('start-game', (req) => {
      console.log('start-game');
      console.log(req);
      const roomID = req['roomID'];
      io.in(roomID).emit('start-game-response'); //これはフロントにゲーム遷移させるためだけのもの
    });

    socket.on('dahai', (req) => {
      socket.emit('dahai-response', req);
    });

    socket.on('ron', (req) => {});

    socket.on('riichi', (req) => {});

    socket.on('tsumo', (req) => {});
  });
};
