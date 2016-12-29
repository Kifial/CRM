import React from 'react';
import { List, ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/checkbox';

class UserItemsList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Paper zDepth={1} style={{margin: '0 0 10px'}}>
        <List>
          <Subheader>Projects List</Subheader>
          <ListItem
            primaryText="Most important at top"
            leftCheckbox={
              <Checkbox
                onCheck={() => this.props.toggleCheckbox()}
              />
            }
          />
          {this.props.projects.map(item =>
            <ListItem
              key={item._id}
              primaryText={item.title}
              primaryTogglesNestedList={true}
              initiallyOpen={true}
              nestedItems={
                item.tasks.map(task => {
                  if (task.active) {
                    return <ListItem
                      key={task.id}
                      primaryText={task.title}
                    />;
                  }
                })
              }
            />
          )}
        </List>
      </Paper>
    );
  }
}

export default UserItemsList;