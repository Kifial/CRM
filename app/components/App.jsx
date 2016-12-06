import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class App extends React.Component {
  render() {
    const userNotLogged = () => {
      return (
        <div>
          <h1>CRM</h1>
          <div>
            <Link
              to="registration"
            >
              Sign up
            </Link>
          </div>
          <div>
            <Link
              to="login"
            >
              Sign in
            </Link>
          </div>
          {this.props.children}
          <div>
            <Link
              to="statistics"
            >
              Statistics
            </Link>
          </div>
        </div>
      );
    };
    const userLogged = () => {
      return (
        <div>
          <h1>CRM</h1>
          <div>
            <Link
              to="/"
              onClick={() => this.props.handleLogOut()}
            >
              Sign out
            </Link>
          </div>
          {this.props.children}
        </div>
      );
    };
    if (this.props.loggedUser) {
      return userLogged();
    } else {
      return userNotLogged();
    }
  }
}

const mapStateToAppProps = (state, ownProps) => {
  return {
    loggedUser: state.account.user.id ? true : false
  }
};

const mapDispatchToAppProps = (dispatch, ownProps) => {
  return {
    handleLogOut: () => {
      dispatch('LOG_OUT');
    }
  };
};

App = connect(
  mapStateToAppProps,
  mapDispatchToAppProps
)(App);

export default App;