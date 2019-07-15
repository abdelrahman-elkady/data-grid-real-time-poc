const http = require('http');

const app = require('./app');
const initSockets = require('./sockets');

const PORT = process.env.PORT || 1337;

const server = http.createServer(app);

initSockets(server);

server.listen(PORT, () => { console.log(`working on port ${PORT}`); });

module.exports.server = server;