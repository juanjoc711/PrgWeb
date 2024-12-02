import { leaveAssociation, joinAssociation } from './associations.js';
import { renderMessages } from '../messages/renderMessage.js'; 
import { switchView } from '../../utils/utils.js';

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
        nameCell.style.cursor = "pointer"; // Cambia el cursor para indicar que es clickeable
        nameCell.onclick = () => {
            // Cambiar a la vista de detalles
            document.getElementById('association-name').textContent = assoc.name;
            document.getElementById('association-description').textContent = assoc.description;
            switchView('association-details-view'); // Cambia la vista
            renderMessages(assoc._id); // Renderiza los mensajes de la asociación
        };
        row.appendChild(nameCell);

        const descCell = document.createElement("td");
        descCell.textContent = assoc.description;
        row.appendChild(descCell);

        const actionCell = document.createElement("td");

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
