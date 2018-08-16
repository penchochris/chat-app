import React, { Component } from 'react';

export default class MessagesInput extends Component {

  constructor(props) {
    super(props);

    this.state = {
      message:"",
      isTyping:false
    }
  }

  sendMessage = () => {
    this.props.sendMessage(this.state.message);
  }

  stopCheckingTyping = () => {
    if(this.typingInterval) {
      clearInterval(this.typingInterval);
      this.props.sendTyping(false);
    }
  }

  startCheckingTyping = () => {
    this.typingInterval = setInterval(() => {
      if((Date.now() - this.lastUpdateTime) > 300) {
        this.setState({isTyping:false});
        this.stopCheckingTyping();
      }
    }, 300);
  }

  sendTyping = () => {
    this.lastUpdateTime = Date.now();
    if (!this.state.isTyping) {
      this.setState({isTyping:true});
      this.props.sendTyping(true);
      this.startCheckingTyping();
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.sendMessage();
    this.setState({message:''});
  }

  componentWillUnMount() {
    this.stopCheckingTyping();
  }

  render() {
    const { message, isTyping } = this.state;
    return (
      <div className="message-input">
        <form 
          onSubmit={ this.handleSubmit }
          className="message-form"  
        >
          <input 
            id="message"
            ref={"messageinput"}
            type="text" 
            className="form-control"
            value={message}
            autoComplete={'off'}
            placeholder="Type here..."
            onKeyUp={e => {e.keyCode !== 13 && this.sendTyping() }}
            onChange={
              ({target}) => {
                this.setState({message:target.value});
              }
            }
          />
          <button 
            className="send"
            type="submit"
            className="send">
            Send
          </button>

        </form>
      </div>
    );
  }
}
