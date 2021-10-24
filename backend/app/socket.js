module.exports = (io) => {
  io.on("connection", function (socket) {
    console.log("connected");

    socket.on("create-room", () => {
      console.log("create-room");
      data = { room_id: 123 };
      socket.emit("create-room-response", data);
    });
    socket.on("enter-room", (req) => {
      console.log(req);
      socket.emit("enter-room-response", req);
    });

    socket.on("start-game", (req) => {
      console.log(req);
      socket.emit("start-game-response", req);
    });
  });
};
