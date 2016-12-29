const report = (state = {}, action) => {
  switch(action.type) {
    case 'MAKE_COMPANY_REPORT':
      return { ...state, id: action.data };
    case 'SET_REPORT_INFO':
      return { ...state, ...action.data };
    default:
      return state;
  }
};

export default report;