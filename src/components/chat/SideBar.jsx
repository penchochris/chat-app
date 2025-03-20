import React, { Component } from "react";

export default class SideBar extends Component {
  render() {
    const { chats, activeChat, user, setActiveChat, logout, connectedUsers } =
      this.props;

    console.log("Hola: ", connectedUsers);
    return (
      <div id="side-bar">
        <div className="heading">
          <div className="app-name">
            My Chat
            <img src="https://png.icons8.com/android/16/000000/expand-arrow.png" />
          </div>
          <div className="menu">
            <img src="https://png.icons8.com/ios-glyphs/24/000000/menu.png" />
          </div>
        </div>
        <div className="search">
          <i className="search-icon">
            <img src="https://png.icons8.com/material-outlined/24/000000/search.png" />
          </i>
          <input placeholder="Search" type="text" />
          <div className="plus"></div>
        </div>
        <div
          className="users"
          ref="users"
          onClick={(e) => {
            e.target === this.refs.user && setActiveChat(null);
          }}
        >
          {chats.map((chat) => {
            if (chat.name) {
              const lastMessage = chat.messages[chat.messages.length - 1];
              const user = chat.users.find(({ name }) => {
                return name !== this.props.name;
              }) || { name: "Community" };
              const classNames =
                activeChat && activeChat.id === chat.id ? "active" : "";

              return (
                <div
                  key={chat.id}
                  className={`user ${classNames}`}
                  onClick={() => {
                    setActiveChat(chat);
                  }}
                >
                  <div className="user-photo">{user.name[0].toUpperCase()}</div>
                  <div className="user-info">
                    <div className="name">{user.name}</div>
                    {lastMessage && (
                      <div className="last-message">{lastMessage.message}</div>
                    )}
                  </div>
                </div>
              );
            }

            return null;
          })}
          <div>
            {connectedUsers &&
              Object.keys(connectedUsers).map((user) => {
                return (
                  <div key={user.id} className="user">
                    {user}
                  </div>
                );
              })}
          </div>
        </div>

        <div className="current-user">
          <span>{user.name}</span>
          <div
            onClick={() => {
              logout();
            }}
            title="Logout"
            className="logout"
          >
            Logout
          </div>
        </div>
      </div>
    );
  }
}
