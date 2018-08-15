import React, { Component } from 'react';
import Layout from './components/Layout';
import './css/index.css';

class App extends Component {
  render() {
    return (
      <div className="container">
        <Layout title="Chat app baby"/>
      </div>
    );
  }
}

export default App;
