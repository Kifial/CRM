import React from 'react';
import { connect } from 'react-redux';
import { getPage, toggleForm, deleteCompany, handleDeleteCompany, linkToSearch, makeCompanyReport } from '../actions/account.jsx';
import socket from '../socket.jsx';
import MakeProjectForm from './MakeProjectForm.jsx';
import ProjectList from './ProjectList.jsx';
import EditCompanyForm from './EditCompanyForm.jsx';
import UserList from './UserList.jsx';
import { Link } from 'react-router';
import { cyan500, pinkA200, grey900 } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  mainTitle: {
    fontSize: '24px',
    color: cyan500,
    margin: '0 0 10px'
  },
  projectsTitle: {
    fontSize: '24px',
    color: cyan500,
    padding: '15px 0 0'
  },
  parentWrap: {
    padding: '20px 15px 0'
  },
  companyDescription: {
    fontSize: '16px',
    color: grey900,
    margin: '0 0 10px 0'
  },
  creatorTitle: {
    fontSize: '16px',
    color: pinkA200,
    margin: '0 0 10px'
  },
  buttonStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1
  },
  addUserButton: {
    margin: '0 0 10px'
  }
};

class CompanyPage extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.getPage(this.props.socket, this.props.collection, this.props.id);
    this.props.handleDelete(this.props.socket);
  }
  componentWillUnmount() {
    this.props.disableSocket(this.props.socket);
  }
  render() {
    return (
      <div style={styles.parentWrap}>
        <h2 style={styles.mainTitle}>{this.props.title}</h2>
        <div style={styles.companyDescription}>{this.props.description}</div>
        <div style={styles.creatorTitle}>{`created by ${this.props.creator}`}</div>
        <FlatButton label="Edit" primary={true}>
          <div
            onClick={() => this.props.toggleEditForm()}
            style={styles.buttonStyle}
          ></div>
        </FlatButton>
        <FlatButton label="Delete" secondary={true}>
          <div
            onClick={() => this.props.deleteCompany(this.props.socket, this.props.id)}
            style={styles.buttonStyle}
          ></div>
        </FlatButton>
        {this.props.editForm ?
          <EditCompanyForm
            title={this.props.title}
            description={this.props.description}
            id={this.props.id}
            socket={this.props.socket}
          /> :
          ''
        }
        <h3 style={styles.projectsTitle}>Projects</h3>
        <ProjectList
          socket={this.props.socket}
          projects={this.props.projects}
          handleCheckbox={() => this.props.handleCheckbox()}
          handleActiveCheckbox={() => this.props.handleActiveCheckbox()}
          checkbox={this.props.projectsCheckbox}
          activeCheckbox={this.props.projectsActiveCheckbox}
        />
        <MakeProjectForm socket={this.props.socket} />
        <UserList users={this.props.users} />
        <RaisedButton
          label="Add user"
          secondary={true}
          style={styles.addUserButton}
        >
          <Link
            to="/search"
            onClick={() => this.props.addUser(this.props.collection, this.props.id)}
            style={styles.buttonStyle}
          />
        </RaisedButton>
        <div>
          <FlatButton
            label="Make report"
            secondary={true}
            style={styles.addUserButton}
          >
            <Link
              to={`/report/company/${this.props.title}`}
              onClick={() => this.props.makeReport(this.props.id)}
              style={styles.buttonStyle}
            />
          </FlatButton>
        </div>
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
    creator: page.creator ? page.creator.name : '',
    editForm: page.editCompanyForm || '',
    projectsCheckbox: page.projectsCheckbox || '',
    projectsActiveCheckbox: page.projectsActiveCheckbox || ''
  };
};

const mapDispatchToCompanyPageProps = (dispatch, ownProps) => {
  return {
    getPage: (socket, collection, id) => {
      getPage(dispatch, socket, collection, id);
    },
    toggleEditForm: () => {
      dispatch(toggleForm('editCompanyForm'));
    },
    deleteCompany: (socket, id) => {
      deleteCompany(dispatch, socket, id);
    },
    handleDelete: (socket) => {
      handleDeleteCompany(dispatch, socket);
    },
    disableSocket: (socket) => {
      socket.off('deleteCompany');
      socket.off('getPage');
    },
    addUser: (collection, id) => {
      dispatch(linkToSearch(collection, id));
    },
    makeReport: (id) => {
      dispatch(makeCompanyReport(id));
    },
    handleCheckbox: () => {
      dispatch({
        type: 'HANDLE_SHOW_PROJECTS'
      })
    },
    handleActiveCheckbox: () => {
      dispatch({
        type: 'HANDLE_SHOW_ACTIVE_PROJECTS'
      });
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