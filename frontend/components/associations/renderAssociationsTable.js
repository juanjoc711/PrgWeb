import { leaveAssociation, joinAssociation } from './associations.js';
import { renderMessages } from '../messages/renderMessage.js'; 
import { switchView } from '../../utils/utils.js';

export function renderAssociationsTable(associations, myAssociations) {
    const tableBody = document.getElementById("associations-body");
    tableBody.innerHTML = "";

    associations.forEach((assoc) => {
        const row = document.createElement("tr");

        // Logo o imagen de la asociación
        const logoCell = document.createElement("td");
        if (assoc.image) {
            const img = document.createElement("img");
            img.src = assoc.image;
            img.alt = "Logo de la asociación";
            img.style.width = "50px";
            img.style.height = "50px";
            logoCell.appendChild(img);
        } else {
            logoCell.textContent = "📷"; // Emoji de cámara por defecto
        }
        row.appendChild(logoCell);

        // Nombre de la asociación con funcionalidad clickeable
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

        // Descripción de la asociación
        const descCell = document.createElement("td");
        descCell.textContent = assoc.description;
        row.appendChild(descCell);

        // Botones de acción (Unirse o Abandonar)
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
