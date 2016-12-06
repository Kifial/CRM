const user = (state = {}, action) => {
  switch(action.type) {
    case 'LOG_USER':
      return Object.assign({}, state, action.userInfo);
    case 'LOG_OUT':
      return {};
    default:
      return state;
  }
};

export default user;