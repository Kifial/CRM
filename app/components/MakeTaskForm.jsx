import React from 'react';
import { connect } from 'react-redux';
import { requestForm, resolveForm, addTask } from '../actions/forms.jsx';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { cyan500 } from 'material-ui/styles/colors';

const styles = {
  formStyle: {
    padding: '20px 0'
  },
  submitStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1
  },
  submitWrapStyle: {
    margin: '10px 0 0'
  },
  welcomeText: {
    color: cyan500,
    fontSize: '20px',
    padding: '20px 0 10px'
  }
};

class MakeTaskForm extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.handleSocket();
  }
  componentWillUnmount() {
    this.props.disableSocket();
  }
  render() {
    return (
      <div>
        <h5 style={styles.welcomeText}>Make Task</h5>
        <form style={styles.formStyle}>
          <div>
            <TextField
              hintText="Task title"
              type="text"
              name="title"
              value={this.props.title || ''}
              onChange={(e) => this.props.handleChange(e.target.value, e.target.name)}
            />
          </div>
          <div>
            <TextField
              hintText="Task description"
              type="text"
              name="description"
              value={this.props.description || ''}
              onChange={(e) => this.props.handleChange(e.target.value, e.target.name)}
            />
          </div>
          <RaisedButton
            label={this.props.requesting ? 'Loading' : 'Submit'}
            primary={true}
            style={styles.submitWrapStyle}
          >
            <div
              onClick={(e) => this.props.handleSubmit(e, {
                title: this.props.title,
                description: this.props.description,
                user: this.props.user,
                userName: this.props.userName,
                project: this.props.project,
                projectTitle: this.props.projectTitle
              })}
              style={styles.submitStyle}
            ></div>
          </RaisedButton>
          <h4>{this.props.success == false ? 'FAILED' : ''}</h4>
        </form>
      </div>
    );
  }
}

const mapStateToMakeTaskForm = (state, ownProps) => {
  if (state.forms.makeTaskForm) {
    const form = state.forms.makeTaskForm;
    return {
      title: form.title,
      description: form.description,
      user: state.account.user.id,
      userName: state.account.user.name,
      project: state.account.currentPage.id,
      projectTitle: state.account.currentPage.title
    };
  } else {
    return {};
  }
};

const mapDispatchToMakeTaskForm = (dispatch, ownProps) => {
  return {
    handleChange: (value, field) => {
      dispatch({
        type: 'HANDLE_FORM_CHANGE',
        form: 'makeTaskForm',
        field,
        value
      });
    },
    handleSubmit: (e, values) => {
      e.preventDefault();
      dispatch(requestForm('makeTaskForm'));
      ownProps.socket.emit('reqMakeTask', {
        title: values.title,
        description: values.description,
        sender: {
          id: values.user,
          name: values.userName
        },
        project: {
          id: values.project,
          title: values.projectTitle
        }
      });
    },
    handleSocket: () => {
      ownProps.socket.on('resMakeTask', (data) => {
        dispatch(resolveForm('makeTaskForm', data.message));
        if (data.message == 'success') {
          dispatch(addTask(data));
        }
      });
    },
    disableSocket: () => {
      ownProps.socket.off('resMakeTask');
    }
  };
};

MakeTaskForm = connect(
  mapStateToMakeTaskForm,
  mapDispatchToMakeTaskForm
)(MakeTaskForm);

export default MakeTaskForm;