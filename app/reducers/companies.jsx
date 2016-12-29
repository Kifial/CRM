const companies = (state = [], action) => {
  switch(action.type) {
    case 'ADD_COMPANY':
      delete action.companyInfo.message;
      return [ ...state, action.companyInfo ];
    case 'SET_COMPANIES':
      return [ ...action.items ];
    case 'EDIT_COMPANY':
      for (let i = 0; i > state.length; i++) {
        if (state[i]._id == action.data.id) {
          return [
            ...state.slice(0, i),
            {
              ...state[i],
              title: action.data.title,
              description: action.data.description
            },
            ...state.slice(i + 1)
          ];
        }
      }
      return state;
    case 'DELETE_COMPANY':
      for (let i = 0; i > state.length; i++) {
        if (state[i]._id == action.id) {
          console.log([
            ...state.slice(0, i),
            ...state.slice(i + 1)
          ]);
          return [
            ...state.slice(0, i),
            ...state.slice(i + 1)
          ];
        }
      }
      return state;
    case 'ADD_USER_TO_COMPANY':
      for (let i = 0; i < state.length; i++) {
        if (state[i].id == action.company.id) {
          return [
            ...state.slice(0, i),
            {
              ...state[i],
              users: [ ...state[i].users, { id: action.user.id, name: action.user.name } ]
            },
            ...state.slice(i + 1)
          ];
        }
      }
      return state;
    case 'ADD_PROJECT':
      for (let i = 0; i < state.length; i++) {
        if (state[i]._id == action.projectInfo.company.id) {
          const project = { id: action.projectInfo._id, title: action.projectInfo.title };
          const arr = [ ...state[i].projects, ...project ];
          const temp = Object.assign({}, state[i], { projects: arr });
          return [
            ...state.slice(0, i),
            temp,
            ...state.slice(i + 1)
          ];
        }
      }
      return state;
    case 'EDIT_PROJECT':
      for (let i = 0; i < state.length; i++) {
        if (state[i]._id == action.data.company) {
          for (let j = 0; i < state[i].projects.length; j++) {
            if (state[i].projects[j].id == action.data.id) {
              const project = {
                ...state[i].projects[j],
                title: action.data.title
              };
              const projects = [
                ...state[i].projects.slice(0, j),
                project,
                ...state[i].projects.slice(j + 1)
              ];
              const company = {
                ...state[i],
                projects
              };
              return [
                ...state.slice(0, i),
                company,
                ...state.slice(i + 1)
              ];
            }
          }
        }
      }
      return state;
    case 'LOG_OUT':
      return [];
    default:
      return state;
  }
};

export default companies;