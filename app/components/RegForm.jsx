import React from 'react';
import { connect } from 'react-redux';
import { requestForm, resolveForm, logUser } from '../actions/forms.jsx';
import { browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  formStyle: {
    padding: '20px 15px'
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
  }
};

class RegForm extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <form style={styles.formStyle}>
        <div>
          <TextField
            hintText="Login Field"
            type="text"
            name="login"
            value={this.props.login || ''}
            onChange={(e) => this.props.handleChange(e.target.value, e.target.name)}
          />
        </div>
        <div>
          <TextField
            hintText="Password Field"
            type="password"
            name="password"
            value={this.props.password || ''}
            onChange={(e) => this.props.handleChange(e.target.value, e.target.name)}
          />
        </div>
        <div>
          <TextField
            hintText="Confirm password Field"
            type="password"
            name="confirmPassword"
            value={this.props.password || ''}
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
              login: this.props.login,
              password: this.props.password
            })}
            style={styles.submitStyle}
          ></div>
        </RaisedButton>
        <h4>{this.props.success == false ? 'FAILED' : ''}</h4>
      </form>
    );
  }
}

const mapStateToRegFormProps = (state, ownProps) => {
  if (state.forms.regForm) {
    const form = state.forms.regForm;
    return {
      login: form.login,
      password: form.password,
      confirmPassword: form.confirmPassword,
      requesting: form.requesting || false,
      success: form.success
    };
  } else {
    return {};
  }
};

const mapDispatchToRegFormProps = (dispatch, ownProps) => {
  return {
    handleChange: (value, field) => {
      dispatch({
        type: 'HANDLE_FORM_CHANGE',
        form: 'regForm',
        field,
        value
      });
    },
    handleSubmit: (e, values) => {
      e.preventDefault();
      dispatch(requestForm('regForm'));
      return new Promise((resolve, reject) => {
        ownProps.socket.emit('reqRegistration', {
          login: values.login,
          password: values.password
        });
        resolve();
      }).then(() => {
        ownProps.socket.on('resRegistration', (data) => {
          dispatch(resolveForm('regForm', data.message));
          if (data.message == 'success') {
            dispatch(logUser(data));
            browserHistory.push('account');
          }
        });
      });
    }
  };
};

RegForm = connect(
  mapStateToRegFormProps,
  mapDispatchToRegFormProps
)(RegForm);

export default RegForm;