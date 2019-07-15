const http = require('http');
const app = require('./app');
const initSockets = require('./sockets');

const server = http.createServer(app);

initSockets(server);

server.listen(1337, () => { console.log('working on port 1337'); });

module.exports.server = server;