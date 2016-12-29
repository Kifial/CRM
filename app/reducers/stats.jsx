import { combineReducers } from 'redux';

const stats = () => {
  const general = (state = {}, action) => {
    switch(action.type) {
      case 'SET_STATS':
        delete action.data.page;
        return {
          ...action.data
        };
      default:
        return state;
    }
  };

  const user = (state = {}, action) => {
    switch(action.type) {
      case 'SET_USER_STATS':
        delete action.data.page;
        return {
          ...action.data
        };
      default:
        return state;
    }
  };

  return combineReducers({
    general,
    user
  });
};

export default stats;