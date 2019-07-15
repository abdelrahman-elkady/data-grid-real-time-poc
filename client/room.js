let socket;
let data;

let roomId;
let userId;

const tableBody = document.querySelector("#table-body");
const currentlyConnectedSpan = document.querySelector("#currently-connected");

const fetchData = () => {
  return fetch("/data")
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
  return new Promise((resolve, reject) => {
    socket = io({
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
      resolve();
    });

    socket.on("connected-members-changed", n => {
      currentlyConnectedSpan.innerHTML = n;
    });

    socket.on("error", err => {
      console.log(err);
      reject();
    });

    socket.on("cell-updated", ({ cellId, value }) => {
      document.querySelector(`#c-${cellId}`).innerHTML = value;
    });
  });
};

const onLoad = () => {
  const params = new URLSearchParams(window.location.search);
  roomId = params.get("roomId");
  userId = params.get("userId");

  fetchData().then(() => {
    initSockets()
      .then(() => populateTableWithData())
      .catch(() => alert('Unauthorized !'));
  });
};

window.addEventListener("load", onLoad);
