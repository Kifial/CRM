import React from 'react';
import { connect } from 'react-redux';
import { getPage } from '../actions/account.jsx';
import socket from '../socket.jsx';
import MakeProjectForm from './MakeProjectForm.jsx';
import ProjectList from './ProjectList.jsx';

class CompanyPage extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.getPage(this.props.socket, this.props.collection, this.props.id);
  }
  render() {
    return (
      <div>
        <h2>{this.props.title}</h2>
        <h4>{this.props.description}</h4>
        <span>{`created by ${this.props.creator}`}</span>
        <h3>Projects</h3>
        <ProjectList socket={this.props.socket} projects={this.props.projects} />
        <MakeProjectForm socket={this.props.socket} />
      </div>
    );
  }
}

const mapStateToCompanyPageProps = (state, ownProps) => {
  const page = state.account.currentPage;
  return {
    id: page.id,
    collection: page.collection,
    title: page.title || '',
    description: page.description || '',
    projects: page.projects || [],
    users: page.users || [],
    creator: page.creator ? page.creator.name : ''
  };
};

const mapDispatchToCompanyPageProps = (dispatch, ownProps) => {
  return {
    getPage: (socket, collection, id) => {
      getPage(dispatch, socket, collection, id);
    }
  };
};

CompanyPage.defaultProps = {
  socket
};

CompanyPage = connect(
  mapStateToCompanyPageProps,
  mapDispatchToCompanyPageProps
)(CompanyPage);

export default CompanyPage;