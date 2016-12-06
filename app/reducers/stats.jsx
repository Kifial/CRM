import { combineReducers } from 'redux';

const stats = () => {
  const general = (state = {}, action) => {
    switch(action.type) {
      case 'SET_STATS':
        return {
          ...action.data
        };
      default:
        return state;
    }
  };

  return combineReducers({
    general
  });
};

export default stats;