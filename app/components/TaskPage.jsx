import React from 'react';
import { connect } from 'react-redux';
import { getPage, linkToSearch } from '../actions/account.jsx';
import socket from '../socket.jsx';
import { grey900, pinkA200, cyan500 } from 'material-ui/styles/colors';
import UserList from './UserList.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router';

const styles = {
  mainTitle: {
    fontSize: '24px',
    color: cyan500,
    margin: '0 0 10px'
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
    zIndex: '1'
  },
  addUserButton: {
    margin: '0 0 10px'
  }
};

class TaskPage extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.getPage(this.props.socket, this.props.collection, this.props.id);
  }
  componentWillUnmount() {
    this.props.disableSocket(this.props.socket);
  }
  render() {
    return (
      <div style={styles.parentWrap}>
        <h2 style={styles.mainTitle}>{this.props.title}</h2>
        <h4 style={styles.companyDescription}>{this.props.description}</h4>
        <div style={styles.creatorTitle}>{`created by ${this.props.sender}`}</div>
        <div style={styles.creatorTitle}>{`Project: ${this.props.project}`}</div>
        <UserList users={this.props.performers} title="User list:" />
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

const mapStateToTaskPageProps = (state, ownProps) => {
  const page = state.account.currentPage;
  return {
    id: page.id,
    collection: page.collection,
    title: page.title || '',
    description: page.description || '',
    subtasks: page.subtasks || [],
    performers: page.performers || [],
    sender: page.sender ? page.sender.name : '',
    project: page.project ? page.project.title : ''
  };
};

const mapDispatchToTaskPageProps = (dispatch, ownProps) => {
  return {
    getPage: (socket, collection, id) => {
      getPage(dispatch, socket, collection, id);
    },
    disableSocket: (socket) => {
      socket.off('getPage');
    },
    addUser: (collection, id) => {
      dispatch(linkToSearch(collection, id));
    }
  };
};

TaskPage.defaultProps = {
  socket
};

TaskPage = connect(
  mapStateToTaskPageProps,
  mapDispatchToTaskPageProps
)(TaskPage);

export default TaskPage;