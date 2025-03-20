import React, { Component } from 'react';
import io from 'socket.io-client';
import { USER_CONNECTED, LOGOUT } from '../js/Events';
import LoginForm from './LoginForm';
import ChatContainer from './chat/ChatContainer';

const socketUrl = "http://localhost:3231";

export default class Layout extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      socket:null
    };
  }

  initSocket = () => {
    const socket = io(socketUrl);

    socket.on('connect', () => {
      console.log('connected!');
    })
    socket.on(USER_CONNECTED, (connectedUsers)=> {
      this.setState({connectedUsers: connectedUsers})
    })
    this.setState({socket});
  }

  setUser = (user) => {
    const { socket } = this.state;
    socket.emit(USER_CONNECTED, user);
    this.setState({user});
  }

  logout = () => {
    const { socket } = this.state;
    socket.emit(LOGOUT);
    this.setState({user:null});
  }

  componentWillMount() {
    this.initSocket();
  }

  render() {
    const { socket, user } = this.state;
    return (
      <div className="container">
        {
          !user ?
            <LoginForm socket={socket} setUser={this.setUser} />
          :
            <ChatContainer socket={socket} user={user} logout={this.logout} />
        }
      </div>
    )
  }

}