import { leaveAssociation, joinAssociation } from './associations.js';

export function renderAssociationsTable(associations, myAssociations) {
    const tableBody = document.getElementById("associations-body");
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
  
      // Asegurarse de que `myAssociations` esté sincronizada
      if (myAssociations && myAssociations.includes(assoc._id)) {
        const leaveButton = document.createElement("button");
        leaveButton.textContent = "Abandonar";
        leaveButton.onclick = () => leaveAssociation(assoc._id);
        actionCell.appendChild(leaveButton);
      } else {
        const joinButton = document.createElement("button");
        joinButton.textContent = "Unirse";
        joinButton.onclick = () => joinAssociation(assoc._id);
        actionCell.appendChild(joinButton);
      }
  
      row.appendChild(actionCell);
      tableBody.appendChild(row);
    });
  }
  