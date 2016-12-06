import { handleFormChange, handleFormRequest, handleFormResolve } from './handleForms.jsx';

const forms = (state = {}, action) => {
  switch(action.type) {
    case 'HANDLE_FORM_CHANGE':
      return { ...state, [action.form]: handleFormChange(state, action) };
    case 'REQUEST_FORM':
      return { ...state, [action.form]: handleFormRequest(state, action) };
    case 'RESOLVE_FORM':
      return { ...state, [action.form]: handleFormResolve(state, action) };
    default:
      return state;
  }
};

export default forms;