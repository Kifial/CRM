import React from 'react';
import { connect } from 'react-redux';
import { setCompanies, handleLink } from '../actions/account.jsx';
import CompanyItem from './CompanyItem.jsx';
import Subheader  from 'material-ui/Subheader';
import { List } from 'material-ui/List';

class CompanyList extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.setCompanies(this.props.userId);
    this.props.handleSetCompanies();
  }
  componentWillUnmount() {
    this.props.socket.off('getCompanies');
  }
  render() {
    if (this.props.companies.length) {
      return (
        <List>
          <Subheader>Your companies</Subheader>
          {this.props.companies.map(item =>
            <CompanyItem
              key={item._id}
              title={item.title}
              description={item.description}
              id={item._id}
              handleLink={() => this.props.handleLink(item._id)}
            />
          )}
        </List>
      );
    } else {
      return (
        <h4>You don't have companies</h4>
      );
    }
  }
}

const mapStateToCompanyList = (state, ownProps) => {
  return {
    companies: state.account.companies || [],
    userId: state.account.user.id
  };
};

const mapDispatchToCompanyList = (dispatch, ownProps) => {
  return {
    setCompanies: (userId) => {
      ownProps.socket.emit('getCompanies', { userId });
    },
    handleSetCompanies: () => {
      ownProps.socket.on('getCompanies', (data) => {
        dispatch(setCompanies(data));
      });
    },
    handleLink: (id) => {
      dispatch(handleLink('companies', id));
    }
  };
};

CompanyList = connect(
  mapStateToCompanyList,
  mapDispatchToCompanyList
)(CompanyList);

export default CompanyList;