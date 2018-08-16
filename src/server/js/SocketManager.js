const io = require('../index.js').io;
const { VERIFY_USER, USER_CONNECTED, LOGOUT, COMMUNITY_CHAT, USER_DISCONNECTED } = require('../../js/Events.js');
const { createUser, createMessage, createChat } = require('../../js/Factories.js');

let connectedUsers = {};

let communityChat = createChat();

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

const sendMessageToChat = (sender) => {
  return (chatId, message) => {
    io.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({message, sender}))
  }
} 

const createCommunityChat = (socket) => {
  socket.on(COMMUNITY_CHAT, (callback) => { 
    callback(communityChat); 
  });
}

const userConnects = (socket) => {
  socket.on(USER_CONNECTED, (user) => {
    connectedUsers = addUser(connectedUsers, user);
    socket.user = user;

    sendMessageToChatFromUser = sendMessageToChat(user.name);

    io.emit(USER_CONNECTED, connectedUsers);
    console.log('Connected:', connectedUsers);
  });
}

const userDisconnects = (socket, event) => {
  socket.on(event, () => {
    if('user' in socket) {
      connectedUsers = removeUser(connectedUsers, socket.user.name);

      io.emit(USER_DISCONNECTED, connectedUsers);
      console.log('Disconnected:', connectedUsers);
    }
  });
}

module.exports = function (socket) {
  console.log(`Socket Id: ${socket.id}`);
  verifyUser(socket);
  createCommunityChat(socket);
  userConnects(socket);
  userDisconnects(socket, 'disconnect');
  userDisconnects(socket, LOGOUT);
}
