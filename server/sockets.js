const SocketIO = require('socket.io');

const SUPER_DUPER_SECRET = '1';

const initSockets = (server) => {
  const io = SocketIO(server);

  // Middleware
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

    socket.on('update', () => {
      console.log(socket.rooms);
    });
  });

  io.on('error', console.error);
};

module.exports = initSockets;