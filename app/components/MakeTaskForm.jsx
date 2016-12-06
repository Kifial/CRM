import React from 'react';
import { connect } from 'react-redux';
import { requestForm, resolveForm, addTask } from '../actions/forms.jsx';

class MakeTaskForm extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.handleSocket();
  }
  render() {
    let title, description;
    return (
      <div>
        <h5>Make Task</h5>
        <form>
          <div>
            <label htmlFor="title">Task title</label>
            <input
              type="text"
              name="title"
              placeholder="Task title"
              ref={node => {
                title = node;
              }}
              value={this.props.title || ''}
              onChange={() => this.props.handleChange(title.value, title.name)}
            />
          </div>
          <div>
            <label htmlFor="description">Task description</label>
            <input
              type="text"
              name="description"
              placeholder="Task description"
              ref={node => {
                description = node;
              }}
              value={this.props.description || ''}
              onChange={() => this.props.handleChange(description.value, description.name)}
            />
          </div>
          <button onClick={(e) => this.props.handleSubmit(e, {
            title: this.props.title,
            description: this.props.description,
            user: this.props.user,
            userName: this.props.userName,
            project: this.props.project,
            projectTitle: this.props.projectTitle
          })}>
            {this.props.requesting ? 'Loading' : 'Submit'}
          </button>
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
    }
  };
};

MakeTaskForm = connect(
  mapStateToMakeTaskForm,
  mapDispatchToMakeTaskForm
)(MakeTaskForm);

export default MakeTaskForm;