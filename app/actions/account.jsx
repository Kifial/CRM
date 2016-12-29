import { browserHistory } from 'react-router';

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

export const toggleForm = (form) => {
  return {
    type: 'TOGGLE_FORM',
    form
  };
};

export const deleteCompany = (dispatch, socket, id) => {
  socket.emit('deleteCompany', { id });
};

export const handleDeleteCompany = (dispatch, socket) => {
  socket.on('deleteCompany', (data) => {
    dispatch({
      type: 'DELETE_COMPANY',
      id: data.id
    });
    browserHistory.push('/account');
  });
};

export const deleteProject = (dispatch, socket, id) => {
  socket.emit('deleteProject', { id });
};

export const handleDeleteProject = (dispatch, socket) => {
  socket.on('deleteProject', (data) => {
    dispatch({
      type: 'DELETE_PROJECT',
      id: data.id
    });
    browserHistory.push('/account');
  });
};

export const linkToSearch = (collection, id) => {
  return {
    type: 'LINKED_TO_SEARCH_PAGE',
    collection,
    id
  };
};

export const setSearchData = (items) => {
  return {
    type: 'SET_SEARCH_DATA',
    items: items.users,
    recUsers: items.recUsers
  };
};

export const addUserToCompany = (data) => {
  return {
    type: 'ADD_USER_TO_COMPANY',
    user: data.user,
    company: data.company
  };
};

export const addUserToProject = (data) => {
  return {
    type: 'ADD_USER_TO_PROJECT',
    user: data.user,
    company: data.company,
    project: data.project
  };
};

export const makeCompanyReport = (data) => {
  return {
    type: 'MAKE_COMPANY_REPORT',
    data
  };
};

export const getUserItems = (data) => {
  for (let i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].tasks.length; j++) {
      if (!data[i].tasks[j].active) {
        data[i].tasks.splice(j, 1);
        j--;
      }
    }
  }
  return {
    type: 'GET_USER_ITEMS',
    data
  };
};

export const sortUserItems = () => {
  return {
    type: 'SORT_USER_ITEMS'
  };
};