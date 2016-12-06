const companies = (state = [], action) => {
  switch(action.type) {
    case 'ADD_COMPANY':
      delete action.companyInfo.message;
      return [ ...state, action.companyInfo ];
    case 'SET_COMPANIES':
      return [ ...state, ...action.items ];
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
    case 'LOG_OUT':
      return [];
    default:
      return state;
  }
};

export default companies;