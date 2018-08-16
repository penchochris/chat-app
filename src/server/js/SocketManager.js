const io = require('../index.js').io;
const { VERIFY_USER, USER_CONNECTED, LOGOUT, COMMUNITY_CHAT, USER_DISCONNECTED, MESSAGE_RECIEVED, MESSAGE_SENT, TYPING } = require('../../js/Events.js');
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

const sendTypingToChat = (user) => {
  return (chatId, isTyping) => {
    io.emit(`${TYPING}-${chatId}`, {user, isTyping});
  }
}

const sendMessageToChat = (sender) => {
  return (chatId, message) => {
    io.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({message, sender}))
  }
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

  let sendMessageToChatFromUser;
  let sendTypingFromUser;

  //Verify users
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

  // Creates community chat
  socket.on(COMMUNITY_CHAT, (callback) => { 
    callback(communityChat); 
  });

  //user connects
  socket.on(USER_CONNECTED, (user) => {
    connectedUsers = addUser(connectedUsers, user);
    socket.user = user;

    sendMessageToChatFromUser = sendMessageToChat(user.name);
    sendTypingFromUser = sendTypingToChat(user.name);

    io.emit(USER_CONNECTED, connectedUsers);
    console.log('Connected:', connectedUsers);
  });

  //User disconects
  userDisconnects(socket, 'disconnect');
  userDisconnects(socket, LOGOUT);

  // Message sent
  socket.on(MESSAGE_SENT, ({chatId, message}) => {
    sendMessageToChatFromUser(chatId, message);
  })

  //Typing
  socket.on(TYPING, ({chatId, isTyping}) => {
    sendTypingFromUser(chatId, isTyping);
  })
}
