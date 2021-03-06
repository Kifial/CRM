import React from 'react';
import { connect } from 'react-redux';
import { requestForm, resolveForm, addProject } from '../actions/forms.jsx';
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

class MakeProjectForm extends React.Component {
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
        <h5 style={styles.welcomeText}>Make Project</h5>
        <form style={styles.formStyle}>
          <div>
            <TextField
              hintText="Project name"
              type="text"
              name="title"
              value={this.props.title || ''}
              onChange={(e) => this.props.handleChange(e.target.value, e.target.name)}
            />
          </div>
          <div>
            <TextField
              hintText="Project description"
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
                company: this.props.company,
                companyTitle: this.props.companyTitle
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
    },
    disableSocket: () => {
      ownProps.socket.off('resMakeProject');
    }
  };
};

MakeProjectForm = connect(
  mapStateToMakeProjectForm,
  mapDispatchToMakeProjectForm
)(MakeProjectForm);

export default MakeProjectForm;