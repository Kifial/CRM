import React from 'react';
import { connect } from 'react-redux';
import { handleLink, handleTasksCheckbox } from '../actions/account.jsx';
import { toggleTask } from '../actions/task.jsx';
import TaskItem from './TaskItem.jsx';

class TaskList extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {

  }
  render() {
    if (this.props.tasks.length) {
      return (
        <div>
          {this.props.tasks.map(item => {
            if (this.props.tasksCheckbox) {
              if (item.active) {
                return <TaskItem
                  key={item.id}
                  title={item.title}
                  id={item.id}
                  active={item.active}
                  handleLink={() => this.props.handleLink(item.id)}
                  toggleTask={() => this.props.toggleTask(item.id)}
                />
              }
            } else {
              return <TaskItem
                key={item.id}
                title={item.title}
                id={item.id}
                active={item.active}
                handleLink={() => this.props.handleLink(item.id)}
                toggleTask={() => this.props.toggleTask(item.id)}
              />
            }
          })}
          <div>
            <input
              type="checkbox"
              name="checkbox"
              onChange={() => this.props.handleCheckbox()}
            />
            <label htmlFor="checkbox">Hide achieved tasks</label>
          </div>
        </div>
      );
    } else {
      return (
        <h4>You don't have tasks in this company</h4>
      );
    }
  }
}

const mapStateToTaskList = (state, ownProps) => {
  return {

  };
};

const mapDispatchToTaskList = (dispatch, ownProps) => {
  return {
    handleLink: (id) => {
      dispatch(handleLink('tasks', id));
    },
    toggleTask: (id) => {
      dispatch(toggleTask(ownProps.socket, id));
    },
    handleCheckbox: () => {
      dispatch(handleTasksCheckbox());
    }
  };
};

TaskList = connect(
  mapStateToTaskList,
  mapDispatchToTaskList
)(TaskList);

export default TaskList;