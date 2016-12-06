import React from 'react';
import { Link } from 'react-router';

class ProjectItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Link
          to={`/project/${this.props.title}`}
          onClick={() => this.props.handleLink()}
        >{this.props.title}</Link>
      </div>
    );
  }
}

export default ProjectItem;