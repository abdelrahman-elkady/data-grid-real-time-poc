let roomId;
let userId;

const tableBody = document.querySelector('#table-body');

const populateTableWithData = () => {
  fetch('http://localhost:1337/data')
    .then(res => res.json())
    .then((data) => {
      const html = data[`r${roomId}`].map(row => {
        return `
        <tr>
          <td data-label="Name">${row.name}</td>
          <td contenteditable="true" data-label="A1">${row.a1}</td>
          <td contenteditable="true" data-label="A2">${row.a2}</td>
        </tr>
      `;
      }).join('\n');

      tableBody.innerHTML = html;
    });
};

const onLoad = () => {
  const params = new URLSearchParams(window.location.search);
  roomId = params.get('roomId');
  userId = params.get('userId');

  populateTableWithData();
};

window.addEventListener('load', onLoad);

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
