import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './App.jsx';
import Welcome from './Welcome.jsx';
import RegPage from './RegPage.jsx';
import Account from './Account.jsx';
import LoginPage from './LoginPage.jsx';
import CompanyPage from './CompanyPage.jsx';
import ProjectPage from './ProjectPage.jsx';
import TaskPage from './TaskPage.jsx';
import StatsPage from './StatsPage.jsx';
import SearchPage from './SearchPage.jsx';
import UserStats from './UserStats.jsx';
import CompanyReport from './CompanyReport.jsx';

injectTapEventPlugin();

const routes = {
  path: '/',
  component: App,
  indexRoute: { component: Welcome },
  childRoutes: [
    { path: 'registration', component: RegPage },
    { path: 'login', component: LoginPage },
    { path: 'account', component: Account },
    { path: 'company/:companyName', component: CompanyPage },
    { path: 'report/company/:companyName', component: CompanyReport },
    { path: 'project/:projectName', component: ProjectPage },
    { path: 'task/:taskId', component: TaskPage },
    { path: 'statistics', component: StatsPage },
    { path: 'search', component: SearchPage },
    { path: 'stats/:userId', component: UserStats }
  ]
};

class Root extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <MuiThemeProvider>
        <Provider store={this.props.store}>
          <Router routes={routes} history={browserHistory} />
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default Root;