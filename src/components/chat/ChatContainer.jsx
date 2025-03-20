import React, { Component } from "react";
import SideBar from "./SideBar";
import {
  MESSAGE_SENT,
  TYPING,
  COMMUNITY_CHAT,
  MESSAGE_RECIEVED,
} from "../../js/Events";
import ChatHeading from "./ChatHeading";
import Messages from "../messages/Messages";
import MessagesInput from "../messages/MessagesInput";

export default class ChatContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chats: [],
      activeChat: null,
    };
  }

  sendMessage = (chatId, message) => {
    const { socket } = this.props;
    console.log({ chatId, message });
    socket.emit(MESSAGE_SENT, { chatId, message });
  };

  sendTyping = (chatId, isTyping) => {
    const { socket } = this.props;
    socket.emit(TYPING, { chatId, isTyping });
  };

  setActiveChat = (activeChat) => {
    this.setState({ activeChat });
  };

  resetChat = (chat) => {
    return this.addChat(chat, true);
  };

  addChat = (chat, reset) => {
    const { socket } = this.props;
    const { chats } = this.state;

    const newChats = reset ? [chat] : [...chats, chat];
    this.setState({ chats: newChats });

    const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`;
    const typingEvent = `${TYPING}-${chat.id}`;

    socket.on(typingEvent);
    socket.on(messageEvent, this.addMessageToChat(chat.id));
  };

  addMessageToChat = (chatId) => {
    return (message) => {
      const { chats } = this.state;
      console.log(chats);
      let newChats = chats.map((chat) => {
        chat.id === chatId && chat.messages.push(message);
        return chat;
      });
      this.setState({ chats: newChats });
    };
  };

  updateTypingInChat = (chatId) => {};

  componentWillMount() {
    const { socket } = this.props;
    socket.emit(COMMUNITY_CHAT, this.resetChat);
  }

  render() {
    const { user, logout } = this.props;
    const { chats, activeChat } = this.state;
    return (
      <div className="container">
        <SideBar
          logout={logout}
          chats={chats}
          user={user}
          activeChat={activeChat}
          setActiveChat={this.setActiveChat}
        />
        <div className="chat-room-container">
          {activeChat !== null ? (
            <div className="chat-room">
              <ChatHeading name={activeChat.name} />
              <Messages
                messages={activeChat.messages}
                user={user}
                typingUsers={activeChat.typingUsers}
              />
              <MessagesInput
                sendMessage={(message) => {
                  this.sendMessage(activeChat.id, message);
                }}
                sendTyping={(isTyping) => {
                  this.sendTyping(activeChat.id, isTyping);
                }}
              />
            </div>
          ) : (
            <div className="chat-room choose">
              <h3>Choose a room</h3>
            </div>
          )}
        </div>
      </div>
    );
  }
}
