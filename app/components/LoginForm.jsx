import React from 'react';
import { connect } from 'react-redux';
import { requestForm, resolveForm, logUser } from '../actions/forms.jsx';
import { browserHistory } from 'react-router';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let login, password;
    return (
      <form>
        <div>
          <label htmlFor="login">Login</label>
          <input
            type="text"
            name="login"
            placeholder="Login"
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
            name="password"
            placeholder="Password"
            ref={node => {
              password = node;
            }}
            value={this.props.password || ''}
            onChange={() => this.props.handleChange(password.value, password.name)}
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

const mapStateToLoginForm = (state, ownProps) => {
  if (state.forms.loginForm) {
    const form = state.forms.loginForm;
    return {
      login: form.login,
      password: form.password,
      requesting: form.requesting || false,
      success: form.success
    };
  } else {
    return {};
  }
};

const mapDispatchToLoginForm = (dispatch, ownProps) => {
  return {
    handleChange: (value, field) => {
      dispatch({
        type: 'HANDLE_FORM_CHANGE',
        form: 'loginForm',
        field,
        value
      });
    },
    handleSubmit: (e, values) => {
      e.preventDefault();
      dispatch(requestForm('loginForm'));
      return new Promise((resolve, reject) => {
        ownProps.socket.emit('reqLogin', {
          login: values.login,
          password: values.password
        });
        resolve();
      }).then(() => {
        ownProps.socket.on('resLogin', (data) => {
          dispatch(resolveForm('loginForm', data.message));
          if (data.message == 'success') {
            dispatch(logUser(data));
            browserHistory.push('account');
          }
        });
      });
    }
  };
};

LoginForm = connect(
  mapStateToLoginForm,
  mapDispatchToLoginForm
)(LoginForm);

export default LoginForm;