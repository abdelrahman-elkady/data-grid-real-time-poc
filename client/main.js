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