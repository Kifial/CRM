const currentPage = (state = {}, action) => {
  switch(action.type) {
    case 'LINKED_TO_PAGE':
      return {
        collection: action.collection,
        id: action.id
      };
    case 'SET_PAGE_INFO':
      return {
        ...state,
        ...action.data
      };
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [ ...state.projects, action.projectInfo ]
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [ ...state.tasks, action.taskInfo ]
      };
    case 'TOGGLE_TASK':
      for (let i = 0; i < state.tasks.length; i++) {
        if (state.tasks[i].id == action.id) {
          const task = Object.assign({}, state.tasks[i], { active: !state.tasks[i].active });
          return {
            ...state,
            tasks: [
              ...state.tasks.slice(0, i),
              task,
              ...state.tasks.slice(i + 1)
            ]
          };
        }
      }
      return state;
    case 'TOGGLE_TASKS_CHECKBOX':
      return {
        ...state,
        tasksCheckbox: !state.tasksCheckbox
      };
    default:
      return state;
  }
};

export default currentPage;