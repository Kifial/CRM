import React from 'react';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';

const styles = {
  linkStyle: {
    position: 'absolute',
    display: 'block',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1
  },
  parentStyle: {
    position: 'relative',
    top: '5px'
  }
};

class LoginButtons extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const userNotLogged = () => {
      return (
        <div style={styles.parentStyle}>
          <FlatButton label="Sign up" labelStyle={{color: '#ffffff'}}>
            <Link
              to="registration"
              style={styles.linkStyle}
            />
          </FlatButton>
          <FlatButton label="Sign in" labelStyle={{color: '#ffffff'}}>
            <Link
              to="login"
              style={styles.linkStyle}
            />
          </FlatButton>
        </div>
      );
    };
    const userLogged = () => {
      return (
        <div style={styles.parentStyle}>
          <FlatButton label="Sign out" labelStyle={{color: '#ffffff'}}>
            <Link
              to="/"
              style={styles.linkStyle}
              onClick={() => this.props.handleLogOut()}
            />
          </FlatButton>
        </div>
      );
    };
    if (this.props.logged) {
      return userLogged();
    } else {
      return userNotLogged();
    }
  }
}

export default LoginButtons;