const io = require('../index.js').io;
const { VERIFY_USER, USER_CONNECTED, LOGOUT } = require('../../js/Events.js');
const { createUser, createMessage, createChat } = require('../../js/Factories.js');

let connectedUsers = {};

const isUser = (userList, username) => {
  return username in userList;
}

const removeUser = (userList, username) => {
  let newList = Object.assign({}, userList);
  delete newList[username];
  return newList;
}

const addUser = (userList, user) => {
  let newList = Object.assign({}, userList);
  newList[user.name] = user;
  return newList;
}

const verifyUser = (socket) => {
  socket.on(VERIFY_USER, (nickname, callback) => {
    if (isUser(connectedUsers, nickname)) {
      callback({
        isUser: true,
        user: null
      })
    } else {
      callback({
        isUser: false,
        user:createUser({name:nickname})
      })
    }

  })
}

connectWithUsername = (socket) => {
  socket.on(USER_CONNECTED, (user) => {
    connectedUsers = addUser(connectedUsers, user);
    socket.user = user;

    io.emit(USER_CONNECTED, connectedUsers);
    console.log(connectedUsers);
  });
}

module.exports = function (socket) {
  console.log(`Socket Id: ${socket.id}`);
  verifyUser(socket);
  connectWithUsername(socket);
}
