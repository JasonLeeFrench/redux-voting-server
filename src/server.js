import Server from 'socket.io';

export default function startServer(store){
  const io = new Server().attach(8090);
  store.subscribe(
    () => io.emit('state', store.getState().toJS()) //TODO this pushes whole state
  );
  io.on('connection', (socket) => {
    socket.emit('state', store.getState().toJS()) //TODO this pushes whole state
    socket.on('action', store.dispatch.bind(store)); //TODO insecure!! anyone can connect and send to the store.
  });
}
