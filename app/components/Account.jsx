import React from 'react';
import { connect } from 'react-redux';
import socket from '../socket.jsx';
import MakeCompanyForm from './MakeCompanyForm.jsx';
import CompanyList from './CompanyList.jsx';
import { Link } from 'react-router';
import { cyan500, pinkA200 } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import UserItemsList from './UserItemsList.jsx';
import { getUserItems, sortUserItems } from '../actions/account.jsx';

const styles = {
  welcomeText: {
    color: cyan500,
    fontSize: '22px',
    fontFamily: 'Roboto, sans-serif',
  },
  companyTitle: {
    color: pinkA200
  },
  parentStyle: {
    padding: '20px 15px 0'
  },
  linkStyle: {
    position: 'absolute',
    display: 'block',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1
  }
};

class Account extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.getUserItems(this.props.socket, this.props.userId);
  }
  componentWillUnmount() {
    this.props.disableSocket(this.props.socket);
  }
  render() {
    return (
      <div style={styles.parentStyle}>
        <h3 style={styles.welcomeText}>Hello, {this.props.userName}!</h3>
        <CompanyList socket={this.props.socket} />
        <MakeCompanyForm socket={this.props.socket} />
        <FlatButton
          label="User statistic"
          secondary={true}
          style={{
            margin: '0 0 10px'
          }}
        >
          <Link
            to={`stats/${this.props.userId}`}
            style={styles.linkStyle}
          />
        </FlatButton>
        <UserItemsList
          projects={this.props.userItems}
          toggleCheckbox={() => this.props.toggleCheckbox()}
        />
      </div>
    );
  }
}

Account.defaultProps = {
  socket
};

const mapStateToAccountProps = (state, ownProps) => {
  return {
    userId: state.account.user.id,
    userName: state.account.user.name,
    companies: state.account.companies || [],
    userItems: state.account.userItems || []
  };
};

const mapDispatchToAccountProps = (dispatch) => {
  return {
    getUserItems: (socket, id) => {
      socket.emit('getUserItems', { id });
      socket.on('getUserItems', (data) => {
        dispatch(getUserItems(data.result));
      });
    },
    disableSocket: (socket) => {
      socket.off('getUserItems');
    },
    toggleCheckbox: () => {
      dispatch(sortUserItems());
    }
  };
};

Account = connect(
  mapStateToAccountProps,
  mapDispatchToAccountProps
)(Account);

export default Account;