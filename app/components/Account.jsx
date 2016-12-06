import React from 'react';
import { connect } from 'react-redux';
import socket from '../socket.jsx';
import MakeCompanyForm from './MakeCompanyForm.jsx';
import CompanyList from './CompanyList.jsx';

class Account extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h3>Hello, {this.props.userName}!</h3>
        <CompanyList socket={socket} />
        <MakeCompanyForm socket={socket} />
      </div>
    );
  }
}

const mapStateToAccountProps = (state, ownProps) => {
  return {
    userName: state.account.user.login,
    companies: state.account.companies || []
  };
};

const mapDispatchToAccountProps = (dispatch) => {
  return {

  };
};

Account = connect(
  mapStateToAccountProps,
  mapDispatchToAccountProps
)(Account);

export default Account;