const socket = io('localhost:1337', {
  transportOptions: {
    polling: {
      extraHeaders: {
        'x-ws-secret': '1'
      }
    }
  }
});

socket.on('connect', () => {
  console.log(socket.id);
});

socket.on('amr', (event) => {
  console.log(event);
});

socket.on('error', (err) => {
  console.log(err);
});
