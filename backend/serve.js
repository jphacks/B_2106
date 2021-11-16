require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const PORT = process.env.APP_PORT || 8080;

process.on("uncaughtException", (err) => {
  console.log("-------------top level raised error-------------");
  console.error(err);
  console.log("------------------------------------------------");
});

const socket = require("./socket");

const rooms = {};

app.get("/", function (req, res) {
  res.send("hello world");
});

http.listen(PORT, function () {
  console.log("http listening. Port:" + PORT);
});

socket(io, rooms);
