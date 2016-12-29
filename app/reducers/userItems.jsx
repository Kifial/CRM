const userItems = (state = [], action) => {
  switch(action.type) {
    case 'GET_USER_ITEMS':
      return action.data;
    case 'SORT_USER_ITEMS':
      return [ ...state.sort((a, b) => b.tasks.length - a.tasks.length) ];
    default:
      return state;
  }
};

export default userItems;