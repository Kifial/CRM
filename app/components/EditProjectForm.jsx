import React from 'react';
import { connect } from 'react-redux';
import { requestForm, resolveForm, editProject } from '../actions/forms.jsx';

class EditProjectForm extends React.Component {
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
    let title, description;
    return (
      <div>
        <h5>Edit Project</h5>
        <form>
          <div>
            <label htmlFor="title">Project name</label>
            <input
              type="text"
              name="title"
              placeholder="Project name"
              ref={node => {
                title = node;
              }}
              value={this.props.title || ''}
              onChange={() => this.props.handleChange(title.value, title.name)}
            />
          </div>
          <div>
            <label htmlFor="description">Project description</label>
            <input
              type="text"
              name="description"
              placeholder="Project description"
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
            id: this.props.id
          })}>
            {this.props.requesting ? 'Loading' : 'Submit'}
          </button>
          <h4>{this.props.success == false ? 'FAILED' : ''}</h4>
        </form>
      </div>
    );
  }
}

const mapStateToEditProjectForm = (state, ownProps) => {
  if (state.forms.editProjectForm) {
    const form = state.forms.editProjectForm;
    return {
      title: form.title || ownProps.title,
      description: form.description || ownProps.description
    };
  } else {
    return {};
  }
};

const mapDispatchToEditProjectForm = (dispatch, ownProps) => {
  return {
    handleChange: (value, field) => {
      dispatch({
        type: 'HANDLE_FORM_CHANGE',
        form: 'editProjectForm',
        field,
        value
      });
    },
    handleSubmit: (e, values) => {
      e.preventDefault();
      dispatch(requestForm('editProjectForm'));
      ownProps.socket.emit('editProject', {
        title: values.title,
        description: values.description,
        id: values.id
      });
    },
    handleSocket: () => {
      ownProps.socket.on('editProject', (data) => {
        dispatch(resolveForm('editProjectForm', data.message));
        if (data.message == 'success') {
          dispatch(editProject(data));
        }
      });
    },
    disableSocket: () => {
      ownProps.socket.off('editProject');
    }
  };
};

EditProjectForm = connect(
  mapStateToEditProjectForm,
  mapDispatchToEditProjectForm
)(EditProjectForm);

export default EditProjectForm;