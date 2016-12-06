import React from 'react';
import { connect } from 'react-redux';
import { getPage } from '../actions/account.jsx';
import socket from '../socket.jsx';
import MakeTaskForm from './MakeTaskForm.jsx';
import TaskList from './TaskList.jsx';

class ProjectPage extends React.Component {
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
        <div>{`created by ${this.props.creator}`}</div>
        <div>{`Company: ${this.props.company}`}</div>
        <h3>Tasks</h3>
        <TaskList
          socket={this.props.socket}
          tasks={this.props.tasks}
          tasksCheckbox={this.props.tasksCheckbox} />
        <MakeTaskForm socket={this.props.socket} />
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
    tasksCheckbox: page.tasksCheckbox || false
  };
};

const mapDispatchToProjectPageProps = (dispatch, ownProps) => {
  return {
    getPage: (socket, collection, id) => {
      getPage(dispatch, socket, collection, id);
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