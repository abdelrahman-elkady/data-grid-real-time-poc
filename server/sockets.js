const SocketIO = require('socket.io');

const SUPER_DUPER_SECRET = 'amxrZmRoamxmYXNkbGY';

const users = [
  { userId: "1", allowedRooms: ["1"] },
  { userId: "2", allowedRooms: ["2"] },
];

const initSockets = (server) => {
  const io = SocketIO(server);

  // Middleware
  io.use((socket, next) => {
    const clientSecret = socket.handshake.headers['x-ws-secret'];
    const userId = socket.handshake.headers['x-user-id'];
    const requestedRoomId = socket.handshake.headers['x-room-id'];

    if (clientSecret !== SUPER_DUPER_SECRET) { return next(new Error('secret authentication error')); }

    const user = users.find(u => u.userId === userId);
    if (!user) { return next(new Error('authentication error')); }

    if (!user.allowedRooms.includes(requestedRoomId)) {
      return next(new Error('NOT AUTHORIZED'));
    }

    return next();
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