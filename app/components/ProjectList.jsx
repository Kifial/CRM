import React from 'react';
import { connect } from 'react-redux';
import { handleLink } from '../actions/account.jsx';
import ProjectItem from './ProjectItem.jsx';

class ProjectList extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {

  }
  render() {
    if (this.props.projects.length) {
      return (
        <div>
          {this.props.projects.map(item =>
            <ProjectItem
              key={item.id}
              title={item.title}
              description={item.description}
              id={item.id}
              handleLink={() => this.props.handleLink(item.id)}
            />
          )}
        </div>
      );
    } else {
      return (
        <h4>You don't have projects in this company</h4>
      );
    }
  }
}

const mapStateToProjectList = (state, ownProps) => {
  return {

  };
};

const mapDispatchToProjectList = (dispatch, ownProps) => {
  return {
    handleLink: (id) => {
      dispatch(handleLink('projects', id));
    }
  };
};

ProjectList = connect(
  mapStateToProjectList,
  mapDispatchToProjectList
)(ProjectList);

export default ProjectList;