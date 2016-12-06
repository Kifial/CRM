import React from 'react';
import { connect } from 'react-redux';
import { requestForm, resolveForm, addProject } from '../actions/forms.jsx';

class MakeProjectForm extends React.Component {
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
        <h5>Make Project</h5>
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
            user: this.props.user,
            userName: this.props.userName,
            company: this.props.company,
            companyTitle: this.props.companyTitle
          })}>
            {this.props.requesting ? 'Loading' : 'Submit'}
          </button>
          <h4>{this.props.success == false ? 'FAILED' : ''}</h4>
        </form>
      </div>
    );
  }
}

const mapStateToMakeProjectForm = (state, ownProps) => {
  if (state.forms.makeProjectForm) {
    const form = state.forms.makeProjectForm;
    return {
      title: form.title,
      description: form.description,
      user: state.account.user.id,
      userName: state.account.user.name,
      company: state.account.currentPage.id,
      companyTitle: state.account.currentPage.title
    };
  } else {
    return {};
  }
};

const mapDispatchToMakeProjectForm = (dispatch, ownProps) => {
  return {
    handleChange: (value, field) => {
      dispatch({
        type: 'HANDLE_FORM_CHANGE',
        form: 'makeProjectForm',
        field,
        value
      });
    },
    handleSubmit: (e, values) => {
      e.preventDefault();
      dispatch(requestForm('makeProjectForm'));
      ownProps.socket.emit('reqMakeProject', {
        title: values.title,
        description: values.description,
        user: values.user,
        name: values.userName,
        companyId: values.company,
        companyTitle: values.companyTitle
      });
    },
    handleSocket: () => {
      ownProps.socket.on('resMakeProject', (data) => {
        dispatch(resolveForm('makeProjectForm', data.message));
        if (data.message == 'success') {
          dispatch(addProject(data));
        }
      });
    }
  };
};

MakeProjectForm = connect(
  mapStateToMakeProjectForm,
  mapDispatchToMakeProjectForm
)(MakeProjectForm);

export default MakeProjectForm;