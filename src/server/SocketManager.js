const io = require('./index.js').io;

const SocketManager = (socket) => {
  console.log(`Socket Id: ${socket.io}`);
};

module.exports = SocketManager;