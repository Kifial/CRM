import { combineReducers } from 'redux';
import companies from './companies.jsx';
import user from './user.jsx';
import currentPage from './currentPage.jsx';
import tasks from './tasks.jsx';
import userItems from './userItems.jsx';

const account = combineReducers({
  user,
  companies,
  tasks,
  currentPage,
  userItems
});

export default account;