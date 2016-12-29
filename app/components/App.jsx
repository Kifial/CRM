import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import LoginButtons from './LoginButtons.jsx';
import AppBar from 'material-ui/AppBar';
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
  statisticButton: {
    margin: '0 0 0 15px'
  }
};

class App extends React.Component {
  render() {
    return (
      <div>
        <AppBar
          title={<span>CRM</span>}
          iconElementRight={<LoginButtons logged={this.props.loggedUser} />}
          iconElementLeft={<span></span>}
        />
        {this.props.children}
        <div>
          <FlatButton
            label="General statistic"
            secondary={true}
            style={styles.statisticButton}
          >
            <Link
              to="statistics"
              style={styles.linkStyle}
            />
          </FlatButton>
        </div>
      </div>
    );
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