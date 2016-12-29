import React from 'react';
import UserList from './UserList.jsx';
import { connect } from 'react-redux';
import socket from '../socket.jsx';
import { setSearchData, addUserToCompany, addUserToProject } from '../actions/account.jsx';
import { browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

const styles = {
  buttonStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: '1'
  },
  parentStyle: {
    padding: '20px 15px 0'
  }
};

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    switch(this.props.collection) {
      case 'companies':
        this.props.getSearchData(this.props.socket, this.props.collection, this.props.id);
        break;
      case 'projects':
        this.props.getSearchData(this.props.socket, this.props.collection, this.props.id, this.props.company);
        break;
      case 'tasks':
        this.props.getSearchData(this.props.socket, this.props.collection, this.props.id, this.props.project);
        break;
      default:
        break;
    }
    this.props.handleSocket(this.props.socket);
  }
  componentWillUnmount() {
    this.props.disableSocket(this.props.socket);
  }
  render() {
    return (
      <div style={styles.parentStyle}>
        <TextField
          hintText="search"
          type="text"
          name="Search"
          value={this.props.input || ''}
          onChange={(e) => this.props.handleChange(e.target.value)}
          style={{
            margin: '0 0 10px'
          }}
        />
        <div>
          <FlatButton
            label="Sort by name"
            style={{
              margin: '0 0 10px'
            }}
          >
            <div
              style={styles.buttonStyle}
              onClick={() => this.props.handleSortClick()}
            ></div>
          </FlatButton>
        </div>
        <UserList
          title="User list:"
          users={this.props.visibleItems}
          handleUserClick={(id) => {
            switch(this.props.collection) {
              case 'companies':
                this.props.handleAddToCompany(this.props.socket, this.props.id, id);
                break;
              case 'projects':
                this.props.handleAddToProject(
                  this.props.socket,
                  this.props.company,
                  {
                    id: this.props.id,
                    title: this.props.title
                  },
                  id
                );
                break;
              default:
                break;
            }
          }}
        />
        <UserList
          title="Recommended users"
          users={this.props.recUsers}
          handleUserClick={(id) => {
            switch(this.props.collection) {
              case 'companies':
                this.props.handleAddToCompany(this.props.socket, this.props.id, id);
                break;
              case 'projects':
                this.props.handleAddToProject(
                  this.props.socket,
                  this.props.company,
                  {
                    id: this.props.id,
                    title: this.props.title
                  },
                  id
                );
                break;
              default:
                break;
            }
          }}
        />
      </div>
    )
  }
}

SearchPage.defaultProps = {
  socket
};

const mapStateToSearchPageProps = (state, ownProps) => {
  const page = state.search;
  return {
    collection: page.collection,
    id: page.id,
    items: page.items || [],
    visibleItems: page.visibleItems || [],
    input: page.input || '',
    itemsSorted: page.itemsSorted || false,
    company: state.account.currentPage.company ? state.account.currentPage.company.id : '',
    project: state.account.currentPage.project ? state.account.currentPage.project.id : '',
    title: state.account.currentPage.title || '',
    recUsers: page.recUsers || []
  };
};

const mapDispatchToSearchPageProps = (dispatch, ownProps) => {
  return {
    getSearchData: (socket, collection, id, company) => {
      switch(collection) {
        case 'companies':
          socket.emit('getSearchData', { collection, id });
          break;
        case 'projects':
          socket.emit('getSearchData', { collection, id, company });
          break;
        case 'tasks':
          socket.emit('getSearchData', { collection, id, company });
          break;
        default:
          break;
      }
    },
    handleSocket: (socket) => {
      socket.on('getSearchData', (data) => {
        dispatch(setSearchData(data));
      });
      socket.on('addUserToCompany', (data) => {
        dispatch(addUserToCompany(data));
        browserHistory.push(`/company/${data.company.title}`);
      });
      socket.on('addUserToProject', (data) => {
        dispatch(addUserToProject(data));
        browserHistory.push(`/project/${data.project.title}`);
      });
    },
    disableSocket: (socket) => {
      socket.off('getSearchData');
      socket.off('addUserToCompany');
      socket.off('addUserToProject');
    },
    handleChange: (value) => {
      dispatch({
        type: 'SEARCH_INPUT_CHANGE',
        value
      });
    },
    handleSortClick: () => {
      dispatch({
        type: 'HANDLE_SEARCH_SORT'
      })
    },
    handleAddToCompany: (socket, companyId, user) => {
      socket.emit('addUserToCompany', {
        companyId,
        user
      });
    },
    handleAddToProject: (socket, company, project, user) => {
      socket.emit('addUserToProject', {
        company,
        project,
        user
      });
    }
  };
};

SearchPage = connect(
  mapStateToSearchPageProps,
  mapDispatchToSearchPageProps
)(SearchPage);

export default SearchPage;