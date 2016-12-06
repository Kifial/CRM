import React from 'react';
import { Link } from 'react-router';

class TaskItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Link
          to={`/task/${this.props.id}`}
          onClick={() => this.props.handleLink()}
          style={{
            textDecoration: this.props.active ? '' : 'line-through'
          }}
        >{this.props.title}</Link>
        <span
          onClick={() => this.props.toggleTask()}
        > toggle</span>
      </div>
    );
  }
}

export default TaskItem;