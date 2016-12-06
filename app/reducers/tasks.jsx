const tasks = (state = [], action) => {
  switch(action.type) {
    case 'ADD_TASK':
      return [ ...state, action.taskInfo ];
    case 'TOGGLE_TASK':
      for (let i = 0; i < state.length; i++) {
        if (state[i].id == action.id) {
          const task = Object.assign({}, state[i], { active: !state[i].active });
          return [
            ...state.slice(0, i),
            task,
            ...state.slice(i + 1)
          ];
        }
      }
      return state;
    default:
      return state;
  }
};

export default tasks;