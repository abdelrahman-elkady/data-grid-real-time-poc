const data = [
  { name: 'Abdelrahman Elkady', a1: 24, a2: 21 },
  { name: 'Amr Saber', a1: 26, a2: 22 },
  { name: 'Khaled Mohamed', a1: 28, a2: 30 },
];

const tableBody = document.querySelector('#table-body');

const populateTableWithData = () => {
  const html = data.map(row => {
    return `
    <tr>
      <td data-label="Name">${row.name}</td>
      <td contenteditable="true" data-label="A1">${row.a1}</td>
      <td contenteditable="true" data-label="A2">${row.a2}</td>
    </tr>
  `;
  }).join('\n');

  tableBody.innerHTML = html;
};

window.addEventListener('load', populateTableWithData);