const userInput = document.querySelectorAll('input[name="user"]');
const roomOneButton = document.querySelector('#room-1');
const roomTwoButton = document.querySelector('#room-2');

userInput.forEach(i => {
  i.addEventListener('change', (ev) => {
    const userId = ev.target.value;

    roomOneButton.href = roomOneButton.href.replace(/userId=\d/, `userId=${userId}`);
    roomTwoButton.href = roomOneButton.href.replace(/userId=\d/, `userId=${userId}`);
  });
});

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
