export const handleFormChange = (state = {}, action) => {
  return { ...state[action.form], [action.field]: action.value };
};

export const handleFormRequest = (state = {}, action) => {
  return { ...state[action.form], requesting: true };
};

export const handleFormResolve = (state = {}, action) => {
  return {
    ...state[action.form],
    requesting: false,
    success: action.resolve != 'failed'
  };
};