import React from 'react';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import { cyan500, pinkA200, grey50 } from 'material-ui/styles/colors';

const styles = {
  chip: {
    margin: '4px'
  }
};

class UserItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let avatar = this.props.name.substring(0, 1).toUpperCase();
    return (
      <Chip
        onTouchTap={() => this.props.handleUserClick()}
        style={styles.chip}
        backgroundColor={cyan500}
        labelColor={grey50}
      >
        <Avatar
          size={24}
          backgroundColor={pinkA200}
          color={grey50}
        >
          {avatar}
        </Avatar>
        {this.props.name}
      </Chip>
    )
  }
}

export default UserItem;