/** @format */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.APP_PORT || 8080;

const socket = require('./socket');

app.get('/', function (req, res) {
  res.send('hello world');
});

http.listen(PORT, function () {
  console.log('http listening. Port:' + PORT);
});

socket(io);
