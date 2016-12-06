export const getStats = (socket, statsPage) => {
  socket.emit('getStats', {
    page: statsPage
  });
};

export const setListener = (dispatch, socket) => {
  socket.on('getStats', (data) => {
    dispatch(setStats(data));
  });
};

const setStats = (data) => {
  return {
    type: 'SET_STATS',
    data
  };
};