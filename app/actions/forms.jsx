export const requestForm = (form) => {
  return {
    type: 'REQUEST_FORM',
    form
  };
};

export const resolveForm = (form, resolve) => {
  return {
    type: 'RESOLVE_FORM',
    form,
    resolve
  }
};

export const logUser = (info) => {
  delete info.message;
  return {
    type: 'LOG_USER',
    userInfo: info
  }
};

export const addCompany = (info) => {
  return {
    type: 'ADD_COMPANY',
    companyInfo: info
  }
};

export const addProject = (info) => {
  return {
    type: 'ADD_PROJECT',
    projectInfo: info
  }
};

export const addTask = (info) => {
  return {
    type: 'ADD_TASK',
    taskInfo: info
  }
}

