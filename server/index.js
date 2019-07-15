const path = require('path');
const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');
const cors = require('cors');

const app = express();

const server = http.createServer(app);
const io = SocketIO(server);

const SUPER_DUPER_SECRET = '1';

app.use(express.static(path.join(__dirname, '../client')));
app.use(cors());

app.use(express.json());

// middleware
io.use((socket, next) => {
  let clientSecret = socket.handshake.headers['x-ws-secret'];
  if (clientSecret === SUPER_DUPER_SECRET) {
    return next();
  }
  return next(new Error('authentication error'));
});


io.on('connection', (socket) => {
  console.log('Connection established with ', socket.id);

  socket.join('roomy');

  socket.on('update', (data) => {
    console.log(socket.rooms);
  })
});

io.on('error', console.error);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

server.listen(1337, () => { console.log('working on port 1337'); });

