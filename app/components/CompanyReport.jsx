import React from 'react';
import socket from '../socket.jsx';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  parentWrap: {
    padding: '20px 15px 0'
  },
  listStyle: {
    padding: '0 0 0 15px'
  },
  projectItem: {
    margin: '0 0 10px'
  },
  subTitleStyle: {
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

class CompanyReport extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.getReport(this.props.socket, this.props.id);
  }
  componentWillUnmount() {
    this.props.disableSocket(this.props.socket);
  }
  render() {
    return (
      <div style={styles.parentWrap}>
        <h2>{this.props.companyTitle}</h2>
        <div style={styles.subTitleStyle}>{`Have ${this.props.projects.length} projects`}</div>
        {this.props.projects.map(item =>
          <div key={item.id} style={styles.projectItem}>
            <h3>{item.title}</h3>
            <h4>List of users</h4>
            <ul style={styles.listStyle}>
              {item.users.map(item =>
                <li key={item.id}>{item.name}</li>
              )}
            </ul>
            <h5>{`Amount of tasks have been done this month: ${item.doneTasks}`}</h5>
            <h5>{`Amount of tasks must be done: ${item.activeTasks}`}</h5>
          </div>
        )}
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

CompanyReport.defaultProps = {
  socket
};

const mapStateToCompanyReportProps = (state, ownProps) => {
  const page = state.report;
  return {
    id: page.id,
    companyTitle: page.companyTitle || '',
    projects: page.projects || []
  };
};

const mapDispatchToCompanyReportProps = (dispatch, ownProps) => {
  return {
    getReport: (socket, id) => {
      socket.emit('getCompanyReport', { id });
      socket.on('getCompanyReport', (data) => {
        dispatch({
          type: 'SET_REPORT_INFO',
          data
        });
      });
    },
    disableSocket: (socket) => {
      socket.off('getCompanyReport');
    }
  };
};

CompanyReport = connect(
  mapStateToCompanyReportProps,
  mapDispatchToCompanyReportProps
)(CompanyReport);

export default CompanyReport;