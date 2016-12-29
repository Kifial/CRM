import React from 'react';
import { connect } from 'react-redux';
import { getPage, handleDeleteProject, deleteProject, toggleForm, linkToSearch } from '../actions/account.jsx';
import socket from '../socket.jsx';
import MakeTaskForm from './MakeTaskForm.jsx';
import TaskList from './TaskList.jsx';
import EditProjectForm from './EditProjectForm.jsx';
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

class ProjectPage extends React.Component {
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
        <h4 style={styles.companyDescription}>{this.props.description}</h4>
        <div style={styles.creatorTitle}>{`created by ${this.props.creator}`}</div>
        <div style={styles.creatorTitle}>{`Company: ${this.props.company}`}</div>
        <FlatButton label="Edit" primary={true}>
          <div
            onClick={() => this.props.toggleEditForm()}
            style={styles.buttonStyle}
          ></div>
        </FlatButton>
        <FlatButton label="Delete" secondary={true}>
          <div
            onClick={() => this.props.deleteProject(this.props.socket, this.props.id)}
            style={styles.buttonStyle}
          ></div>
        </FlatButton>
        {this.props.editForm ?
          <EditProjectForm
            title={this.props.title}
            description={this.props.description}
            id={this.props.id}
            socket={this.props.socket}
          /> :
          ''
        }
        <h3 style={styles.projectsTitle}>Tasks</h3>
        <TaskList
          socket={this.props.socket}
          tasks={this.props.tasks}
          tasksCheckbox={this.props.tasksCheckbox} />
        <MakeTaskForm socket={this.props.socket} />
        <UserList users={this.props.users} title="User list:" />
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
      </div>
    );
  }
}

const mapStateToProjectPageProps = (state, ownProps) => {
  const page = state.account.currentPage;
  return {
    id: page.id,
    collection: page.collection,
    title: page.title || '',
    description: page.description || '',
    tasks: page.tasks || [],
    users: page.users || [],
    creator: page.creator ? page.creator.name : '',
    company: page.company ? page.company.title : '',
    tasksCheckbox: page.tasksCheckbox || false,
    editForm: page.editProjectForm || ''
  };
};

const mapDispatchToProjectPageProps = (dispatch, ownProps) => {
  return {
    getPage: (socket, collection, id) => {
      getPage(dispatch, socket, collection, id);
    },
    toggleEditForm: () => {
      dispatch(toggleForm('editProjectForm'));
    },
    deleteProject: (socket, id) => {
      deleteProject(dispatch, socket, id);
    },
    handleDelete: (socket) => {
      handleDeleteProject(dispatch, socket);
    },
    disableSocket: (socket) => {
      socket.off('deleteProject');
      socket.off('getPage');
    },
    addUser: (collection, id) => {
      dispatch(linkToSearch(collection, id));
    }
  };
};

ProjectPage.defaultProps = {
  socket
};

ProjectPage = connect(
  mapStateToProjectPageProps,
  mapDispatchToProjectPageProps
)(ProjectPage);

export default ProjectPage;