import React from 'react';
import { connect } from 'react-redux';
import { requestForm, resolveForm, editCompany } from '../actions/forms.jsx';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { cyan500 } from 'material-ui/styles/colors';

const styles = {
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
  mainTitle: {
    color: cyan500,
    fontSize: '18px',
    padding: '20px 0 10px'
  },
  parentWrap: {
    margin: '0 0 20px'
  }
};

class EditCompanyForm extends React.Component {
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
      <div style={styles.parentWrap}>
        <h5 style={styles.mainTitle}>Edit Company</h5>
        <form>
          <div>
            <TextField
              hintText="Company name"
              type="text"
              name="title"
              value={this.props.title || ''}
              onChange={(e) => this.props.handleChange(e.target.value, e.target.name)}
            />
          </div>
          <div>
            <TextField
              hintText="Company description"
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
                id: this.props.id
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

const mapStateToEditCompanyForm = (state, ownProps) => {
  if (state.forms.editCompanyForm) {
    const form = state.forms.editCompanyForm;
    return {
      title: form.title || ownProps.title,
      description: form.description || ownProps.description
    };
  } else {
    return {};
  }
};

const mapDispatchToEditCompanyForm = (dispatch, ownProps) => {
  return {
    handleChange: (value, field) => {
      dispatch({
        type: 'HANDLE_FORM_CHANGE',
        form: 'editCompanyForm',
        field,
        value
      });
    },
    handleSubmit: (e, values) => {
      e.preventDefault();
      dispatch(requestForm('editCompanyForm'));
      ownProps.socket.emit('editCompany', {
        title: values.title,
        description: values.description,
        id: values.id
      });
    },
    handleSocket: () => {
      ownProps.socket.on('editCompany', (data) => {
        dispatch(resolveForm('editCompanyForm', data.message));
        if (data.message == 'success') {
          dispatch(editCompany(data));
        }
      });
    },
    disableSocket: () => {
      ownProps.socket.off('editCompany');
    }
  };
};

EditCompanyForm = connect(
  mapStateToEditCompanyForm,
  mapDispatchToEditCompanyForm
)(EditCompanyForm);

export default EditCompanyForm;