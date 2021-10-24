require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const PORT = process.env.APP_PORT || 8080;

app.get("/", function (req, res) {
  res.send("hello world");
});

io.on("connection", function (socket) {
  console.log("connected");
});

http.listen(PORT, function () {
  console.log("http listening. Port:" + PORT);
});
