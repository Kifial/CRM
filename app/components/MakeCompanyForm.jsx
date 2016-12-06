import React from 'react';
import { connect } from 'react-redux';
import { requestForm, resolveForm, addCompany } from '../actions/forms.jsx';

class MakeCompanyForm extends React.Component {
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
        <h5>Make Company</h5>
        <form>
          <div>
            <label htmlFor="title">Company name</label>
            <input
              type="text"
              name="title"
              placeholder="Company name"
              ref={node => {
                title = node;
              }}
              value={this.props.title || ''}
              onChange={() => this.props.handleChange(title.value, title.name)}
            />
          </div>
          <div>
            <label htmlFor="description">Company description</label>
            <input
              type="text"
              name="description"
              placeholder="Company description"
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
            userName: this.props.userName
          })}>
            {this.props.requesting ? 'Loading' : 'Submit'}
          </button>
          <h4>{this.props.success == false ? 'FAILED' : ''}</h4>
        </form>
      </div>
    );
  }
}

const mapStateToMakeCompanyForm = (state, ownProps) => {
  if (state.forms.makeCompanyForm) {
    const form = state.forms.makeCompanyForm;
    return {
      title: form.title,
      description: form.description,
      user: state.account.user.id,
      userName: state.account.user.name
    };
  } else {
    return {};
  }
};

const mapDispatchToMakeCompanyForm = (dispatch, ownProps) => {
  return {
    handleChange: (value, field) => {
      dispatch({
        type: 'HANDLE_FORM_CHANGE',
        form: 'makeCompanyForm',
        field,
        value
      });
    },
    handleSubmit: (e, values) => {
      e.preventDefault();
      dispatch(requestForm('makeCompanyForm'));
      ownProps.socket.emit('reqMakeCompany', {
        title: values.title,
        description: values.description,
        user: values.user,
        name: values.userName
      });
    },
    handleSocket: () => {
      ownProps.socket.on('resMakeCompany', (data) => {
        dispatch(resolveForm('makeCompanyForm', data.message));
        if (data.message == 'success') {
          dispatch(addCompany(data));
        }
      });
    }
  };
};

MakeCompanyForm = connect(
  mapStateToMakeCompanyForm,
  mapDispatchToMakeCompanyForm
)(MakeCompanyForm);

export default MakeCompanyForm;