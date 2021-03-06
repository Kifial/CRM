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

class StatsPage extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.setListener(this.props.socket);
    this.props.getStats(this.props.socket);
  }
  componentWillUnmount() {
    this.props.disableSocket(this.props.socket);
  }
  render() {
    return (
      <div style={styles.parentWrap}>
        <h2 style={styles.mainTitle}>{`Amount of registered users: ${this.props.users}`}</h2>
        <h2 style={styles.mainTitle}>{`Amount of companies: ${this.props.companies}`}</h2>
        <h2 style={styles.mainTitle}>{`Amount of projects: ${this.props.projects}`}</h2>
        <h2 style={styles.mainTitle}>{`Amount of tasks: ${this.props.tasks}`}</h2>
        <h3 style={styles.secondaryTitle}>{`Users on website: 1`}</h3>
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

StatsPage.defaultProps = {
  socket
};

const mapStateToStatsPageProps = (state) => {
  const stats = state.stats.general;
  return {
    users: stats.users || '',
    companies: stats.companies || '',
    projects: stats.projects || '',
    tasks: stats.tasks || ''
  };
};

const mapDispatchToStatsPageProps = (dispatch, ownProps) => {
  return {
    getStats: (socket) => {
      getStats(socket, 'general');
    },
    setListener: (socket) => {
      setListener(dispatch, socket);
    },
    disableSocket: (socket) => {
      socket.off('getStats');
    }
  };
};

StatsPage = connect(
  mapStateToStatsPageProps,
  mapDispatchToStatsPageProps
)(StatsPage);

export default StatsPage;