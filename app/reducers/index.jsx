import { combineReducers } from 'redux';
import forms from './forms.jsx';
import account from './account.jsx';
import stats from './stats.jsx';
import search from './search.jsx';
import report from './report.jsx';

export const app = combineReducers({
  forms,
  account,
  search,
  report,
  stats: stats()
});