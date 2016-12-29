import React from 'react';
import { connect } from 'react-redux';
import { handleLink } from '../actions/account.jsx';
import ProjectItem from './ProjectItem.jsx';
import { List, ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/checkbox';

class ProjectList extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {

  }
  render() {
    if (this.props.projects.length) {
      return (
        <List>
          <ListItem
            primaryText="Don't show projects without any tasks"
            leftCheckbox={
              <Checkbox
                onCheck={() => this.props.handleCheckbox()}
                checked={this.props.checkbox || false}
              />
            }
          />
          <ListItem
            primaryText="Don't show projects without any active tasks"
            leftCheckbox={
              <Checkbox
                onCheck={() => this.props.handleActiveCheckbox()}
                checked={this.props.activeCheckbox || false}
              />
            }
          />
          {this.props.projects.map(item => {
            if (this.props.checkbox && !this.props.activeCheckbox) {
              if (item.tasks.length !== 0) {
                return <ProjectItem
                  key={item.id || item._id}
                  title={item.title}
                  description={item.description}
                  id={item.id}
                  handleLink={() => this.props.handleLink(item.id || item._id)}
                />;
              }
            } else {
              if (this.props.activeCheckbox) {
                var anyActive = 0;
                for (let i = 0; i < item.tasks.length; i++) {
                  console.log(item.tasks[i]);
                  if (item.tasks[i].active) {
                    anyActive = 1;
                    break;
                  }
                }
                if (!anyActive && item.tasks.length > 0) {
                  return <ProjectItem
                    key={item.id || item._id}
                    title={item.title}
                    description={item.description}
                    id={item.id}
                    handleLink={() => this.props.handleLink(item.id || item._id)}
                  />;
                }
              } else {
                return <ProjectItem
                  key={item.id || item._id}
                  title={item.title}
                  description={item.description}
                  id={item.id}
                  handleLink={() => this.props.handleLink(item.id || item._id)}
                />;
              }
            }
          })}
        </List>
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