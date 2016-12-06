import React from 'react';
import { connect } from 'react-redux';
import socket from '../socket.jsx';
import { getStats, setListener } from '../actions/stats.jsx';

class StatsPage extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.setListener(this.props.socket);
    this.props.getStats(this.props.socket);
  }
  render() {
    return (
      <div>
        <h2>{`Amount of companies: ${this.props.companies}`}</h2>
        <h2>{`Amount of projects: ${this.props.projects}`}</h2>
        <h2>{`Amount of tasks: ${this.props.tasks}`}</h2>
        <h3>{`Users on website: 1`}</h3>
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
    }
  };
};

StatsPage = connect(
  mapStateToStatsPageProps,
  mapDispatchToStatsPageProps
)(StatsPage);

export default StatsPage;