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
    case 'HANDLE_SHOW_PROJECTS':
      return {
        ...state,
        projectsCheckbox: !state.projectsCheckbox
      };
    case 'HANDLE_SHOW_ACTIVE_PROJECTS':
      return {
        ...state,
        projectsActiveCheckbox: !state.projectsActiveCheckbox
      };
    case 'EDIT_COMPANY':
      return {
        ...state,
        title: action.data.title,
        description: action.data.description
      };
    case 'EDIT_PROJECT':
      return {
        ...state,
        title: action.data.title,
        description: action.data.description
      };
    case 'TOGGLE_FORM':
      return {
        ...state,
        [action.form]: !state[action.form]
      };
    case 'ADD_USER_TO_COMPANY':
      return {
        ...state,
        users: [ ...state.users, { id: action.user.id, name: action.user.id } ]
      };
    case 'ADD_USER_TO_PROJECT':
      return {
        ...state,
        users: [ ...state.users, { id: action.user.id, name: action.user.id } ]
      };
    case 'DELETE_COMPANY':
      return {};
    default:
      return state;
  }
};

export default currentPage;