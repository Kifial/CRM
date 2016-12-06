import { combineReducers } from 'redux';
import forms from './forms.jsx';
import account from './account.jsx';
import stats from './stats.jsx';

export const app = combineReducers({
  forms,
  account,
  stats: stats()
});