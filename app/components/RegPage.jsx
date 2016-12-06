import React from 'react';
import RegForm from './RegForm.jsx';
import socket from '../socket.jsx';

class RegPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <RegForm socket={socket} />
      </div>
    )
  }
}

export default RegPage;