import React from 'react';
import { Link } from 'react-router';
import Toggle from 'material-ui/Toggle';

const styles = {
  taskToggle: {
    display: 'inline-block',
    width: 'auto',
    margin: '0 15px 0 0'
  },
  taskWrapper: {
    padding: '10px 0'
  }
};

class TaskItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div style={styles.taskWrapper}>
        <Toggle
          onToggle={() => this.props.toggleTask()}
          toggled={this.props.active ? false : true}
          style={styles.taskToggle}
        />
        <Link
          to={`/task/${this.props.id}`}
          onClick={() => this.props.handleLink()}
          style={{
            textDecoration: this.props.active ? 'none' : 'line-through',
            display: 'inline-block',
            fontSize: '18px',
            color: '#222222'
          }}
        >{this.props.title}</Link>
      </div>
    );
  }
}

export default TaskItem;