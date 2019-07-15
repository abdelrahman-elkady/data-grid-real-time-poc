const SocketIO = require("socket.io");

const data = require("./db");

const SUPER_DUPER_SECRET = "amxrZmRoamxmYXNkbGY";

const users = [
  { userId: "1", allowedRooms: ["1", "2"] },
  { userId: "2", allowedRooms: ["2"] }
];

const initSockets = server => {
  const io = SocketIO(server);

  // Middleware
  io.use((socket, next) => {
    socket.clientSecret = socket.handshake.headers["x-ws-secret"];
    socket.userId = socket.handshake.headers["x-user-id"];
    socket.requestedRoomId = socket.handshake.headers["x-room-id"];

    if (socket.clientSecret !== SUPER_DUPER_SECRET) {
      return next(new Error("secret authentication error"));
    }

    const user = users.find(u => u.userId === socket.userId);
    if (!user) {
      return next(new Error("authentication error"));
    }

    if (!user.allowedRooms.includes(socket.requestedRoomId)) {
      return next(new Error("NOT AUTHORIZED"));
    }

    return next();
  });

  io.on("connection", socket => {
    console.log("Connection established with ", socket.id);

    socket.join(socket.requestedRoomId, () => {
      const connectedUsers =
        io.sockets.adapter.rooms[socket.requestedRoomId] &&
        io.sockets.adapter.rooms[socket.requestedRoomId].length;

      io.to(socket.requestedRoomId).emit("connected-members-changed", connectedUsers);
    });

    socket.on("edit-cell", ({ cellId, value }) => {
      const row = parseInt(`${cellId}`.charAt(0), 10);
      const col = parseInt(`${cellId}`.charAt(1), 10);

      // Sorry
      const propName = `a${col + 1}`;

      data[`r${socket.requestedRoomId}`][row][propName] = value;

      io.to(socket.requestedRoomId).emit("cell-updated", { cellId, value });
    });

    socket.on("disconnect", () => {
      const connectedUsers =
        io.sockets.adapter.rooms[socket.requestedRoomId] &&
        io.sockets.adapter.rooms[socket.requestedRoomId].length;

      io.to(socket.requestedRoomId).emit("connected-members-changed", connectedUsers);
    });
  });

  io.on("error", console.error);
};

module.exports = initSockets;
