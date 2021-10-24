const express = require("express");
const app = express();
const server = require("server").Server(app);
require("dotenv").config();
const io = require("socket.io")(server);
const PORT = process.env.APP_PORT || 8080;

app.get("/", function (req, res) {
  res.send("hello world");
});

io.on("connection", function (socket) {
  console.log("connected");
});

server.listen(PORT, function () {
  console.log("server listening. Port:" + PORT);
});
