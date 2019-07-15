let socket;
let data;

let roomId;
let userId;

const tableBody = document.querySelector("#table-body");
const currentlyConnectedSpan = document.querySelector("#currently-connected");

const fetchData = () => {
  return fetch("http://localhost:1337/data")
    .then(res => res.json())
    .then(responseBody => {
      data = responseBody[`r${roomId}`];
    });
};

const populateTableWithData = () => {
  const html = data
    .map((row, i) => {
      return `
      <tr>
        <td data-label="Name">${row.name}</td>
        <td contenteditable="true" id="c-${i}0" data-cell data-label="A1">${ row.a1 }</td>
        <td contenteditable="true" id="c-${i}1" data-cell data-label="A2">${ row.a2 }</td>
      </tr>
    `;
    })
    .join("\n");

  tableBody.innerHTML = html;

  document.querySelectorAll("[data-cell]").forEach(c => {
    c.addEventListener("blur", ev => {
      const value = ev.target.innerText;
      socket.emit("edit-cell", { cellId: c.id.substring(2), value });
    });
  });
};

const initSockets = () => {
  socket = io("localhost:1337", {
    transportOptions: {
      polling: {
        extraHeaders: {
          "x-ws-secret": "amxrZmRoamxmYXNkbGY",
          "x-room-id": roomId,
          "x-user-id": userId
        }
      }
    }
  });

  socket.on("connect", () => {
    console.log(socket.id);
  });

  socket.on("connected-members-changed", n => {
    currentlyConnectedSpan.innerHTML = n;
  });

  socket.on("error", err => {
    console.log(err);
  });

  socket.on("cell-updated", ({ cellId, value }) => {
    document.querySelector(`#c-${cellId}`).innerHTML = value;
  });
};

const onLoad = () => {
  const params = new URLSearchParams(window.location.search);
  roomId = params.get("roomId");
  userId = params.get("userId");

  fetchData().then(() => {
    populateTableWithData();
    initSockets();
  });
};

window.addEventListener("load", onLoad);
