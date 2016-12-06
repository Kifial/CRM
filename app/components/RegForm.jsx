import React from 'react';
import { connect } from 'react-redux';
import { requestForm, resolveForm, logUser } from '../actions/forms.jsx';
import { browserHistory } from 'react-router';

class RegForm extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let login, password, confirmPassword;
    return (
      <form>
        <div>
          <label htmlFor="login">Login</label>
          <input
            type="text"
            placeholder="Login"
            name="login"
            ref={node => {
              login = node;
            }}
            value={this.props.login || ''}
            onChange={() => this.props.handleChange(login.value, login.name)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={this.props.password || ''}
            ref={node => {
              password = node;
            }}
            onChange={() => this.props.handleChange(password.value, password.name)}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            type="password"
            placeholder="Confirm password"
            name="confirmPassword"
            value={this.props.confirmPassword || ''}
            ref={node => {
              confirmPassword = node;
            }}
            onChange={() => this.props.handleChange(confirmPassword.value, confirmPassword.name)}
          />
        </div>
        <button onClick={(e) => this.props.handleSubmit(e, {
          login: this.props.login,
          password: this.props.password
        })}>
          {this.props.requesting ? 'Loading' : 'Submit'}
        </button>
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