import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import App from './App.jsx';
import Welcome from './Welcome.jsx';
import RegPage from './RegPage.jsx';
import Account from './Account.jsx';
import LoginPage from './LoginPage.jsx';
import CompanyPage from './CompanyPage.jsx';
import ProjectPage from './ProjectPage.jsx';
import TaskPage from './TaskPage.jsx';
import StatsPage from './StatsPage.jsx';

const routes = {
  path: '/',
  component: App,
  indexRoute: { component: Welcome },
  childRoutes: [
    { path: 'registration', component: RegPage },
    { path: 'login', component: LoginPage },
    { path: 'account', component: Account },
    { path: 'company/:companyName', component: CompanyPage },
    { path: 'project/:projectName', component: ProjectPage },
    { path: 'task/:taskId', component: TaskPage },
    { path: 'statistics', component: StatsPage }
  ]
};

class Root extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Provider store={this.props.store}>
        <Router routes={routes} history={browserHistory} />
      </Provider>
    );
  }
}

export default Root;