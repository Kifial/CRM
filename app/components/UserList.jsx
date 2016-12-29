import React from 'react';
import UserItem from './UserItem.jsx';
import { cyan500 } from 'material-ui/styles/colors';

const styles = {
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '0 0 20px'
  },
  title: {
    color: cyan500,
    fontSize: '20px',
    margin: '0 0 10px'
  }
};

class UserList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h4 style={styles.title}>{this.props.title}</h4>
        <div style={styles.wrapper}>
          {this.props.users.map(item =>
            <UserItem
              key={item.id || item._id}
              id={item.id || item._id}
              name={item.name}
              handleUserClick={() => this.props.handleUserClick({
                id: item.id || item._id,
                name: item.name
              })
              }
            />
          )}
        </div>
      </div>
    );
  }
}

export default UserList;