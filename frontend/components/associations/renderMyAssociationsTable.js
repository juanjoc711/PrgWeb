import { leaveAssociation } from './associations.js';

export function renderMyAssociationsTable(associations) {
  const tableBody = document.getElementById("my-associations-body");
  tableBody.innerHTML = "";

  associations.forEach((assoc) => {
    const row = document.createElement("tr");

    const logoCell = document.createElement("td");
    logoCell.textContent = "📷";
    row.appendChild(logoCell);

    const nameCell = document.createElement("td");
    nameCell.textContent = assoc.name;
    row.appendChild(nameCell);

    const descCell = document.createElement("td");
    descCell.textContent = assoc.description;
    row.appendChild(descCell);

    const actionCell = document.createElement("td");
    const leaveButton = document.createElement("button");
    leaveButton.textContent = "Abandonar";
    leaveButton.onclick = () => leaveAssociation(assoc._id);
    actionCell.appendChild(leaveButton);

    row.appendChild(actionCell);
    tableBody.appendChild(row);
  });
}
