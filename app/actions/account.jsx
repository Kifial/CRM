export const setCompanies = (items) => {
  return {
    type: 'SET_COMPANIES',
    items
  }
};

export const setProjects = (items) => {
  return {
    type: 'SET_PROJECTS',
    items
  }
};

export const handleLink = (collection, id) => {
  return {
    type: 'LINKED_TO_PAGE',
    collection,
    id
  }
};

export const getPage = (dispatch, socket, collection, id) => {
  socket.emit('getPage', { collection, id });
  socket.on('getPage', (data) => {
    return dispatch(setPage(data));
  });
};

const setPage = (data) => {
  return {
    type: 'SET_PAGE_INFO',
    data
  };
};

export const handleTasksCheckbox = () => {
  return {
    type: 'TOGGLE_TASKS_CHECKBOX'
  };
};