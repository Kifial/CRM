import React from 'react';
import { connect } from 'react-redux';
import { getPage } from '../actions/account.jsx';
import socket from '../socket.jsx';
//import MakeTaskForm from './MakeTaskForm.jsx';
//import TaskList from './TaskList.jsx';

class TaskPage extends React.Component {
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
        <div>{`created by ${this.props.sender}`}</div>
        <div>{`Project: ${this.props.project}`}</div>
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