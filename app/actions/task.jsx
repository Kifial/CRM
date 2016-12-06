export const toggleTask = (socket, id) => {
  socket.emit('toggleTask',  { id });
  return {
    type: 'TOGGLE_TASK',
    id
  };
};