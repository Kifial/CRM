import React from 'react';
import LoginForm from './LoginForm.jsx';
import socket from '../socket.jsx';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <LoginForm socket={socket} />
      </div>
    );
  }
}

export default LoginPage;