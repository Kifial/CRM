export const getStats = (socket, statsPage, id) => {
  if (id) {
    socket.emit('getStats', {
      page: statsPage,
      id
    });
  } else {
    socket.emit('getStats', {
      page: statsPage
    });
  }
};

export const setListener = (dispatch, socket) => {
  socket.on('getStats', (data) => {
    dispatch(setStats(data));
  });
};

const setStats = (data) => {
  switch(data.page) {
    case 'general':
      return {
        type: 'SET_STATS',
        data
      };
    case 'user':
      return {
        type: 'SET_USER_STATS',
        data
      };
    default:
      return {};
  }
};