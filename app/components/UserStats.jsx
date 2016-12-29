import React from 'react';
import { connect } from 'react-redux';
import socket from '../socket.jsx';
import { getStats, setListener } from '../actions/stats.jsx';
import { cyan500 } from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  parentWrap: {
    padding: '20px 15px 0'
  },
  mainTitle: {
    fontSize: '24px',
    color: cyan500,
    margin: '0 0 10px'
  },
  secondaryTitle: {
    fontSize: '22px',
    color: cyan500,
    margin: '0 0 10px'
  },
  buttonStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: '1'
  }
};

class UserStats extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.setListener(this.props.socket);
    this.props.getStats(this.props.socket, this.props.userId);
  }
  componentWillUnmount() {
    this.props.disableSocket(this.props.socket);
  }
  render() {
    return (
      <div style={styles.parentWrap}>
        <h2 style={styles.mainTitle}>{`Amount of your companies: ${this.props.companies}`}</h2>
        <h2 style={styles.mainTitle}>{`Amount of your projects: ${this.props.projects}`}</h2>
        <h2 style={styles.mainTitle}>{`Amount of your tasks: ${this.props.tasks}`}</h2>
        <h2 style={styles.mainTitle}>{`Amount of tasks you've done: ${this.props.doneTasks}`}</h2>
        <h3 style={styles.secondaryTitle}>{`Users in your companies: 1`}</h3>
        <h3 style={styles.secondaryTitle}>{`Users in your projects: 1`}</h3>
        <RaisedButton
          label="Print it!"
          primary={true}
          style={{
            margin: '0 0 10px'
          }}
        >
          <div
            style={styles.buttonStyle}
            onClick={() => window.print()}
          ></div>
        </RaisedButton>
      </div>
    );
  }
}

UserStats.defaultProps = {
  socket
};

const mapStateToUserStatsProps = (state) => {
  const stats = state.stats.user;
  return {
    userId: state.account.user.id,
    companies: stats.companies || '',
    projects: stats.projects || '',
    tasks: stats.tasks || '',
    doneTasks: stats.doneTasks || ''
  };
};

const mapDispatchToUserStatsProps = (dispatch, ownProps) => {
  return {
    getStats: (socket, id) => {
      getStats(socket, 'user', id);
    },
    setListener: (socket) => {
      setListener(dispatch, socket);
    },
    disableSocket: (socket) => {
      socket.off('getStats');
    }
  };
};

UserStats = connect(
  mapStateToUserStatsProps,
  mapDispatchToUserStatsProps
)(UserStats);

export default UserStats;