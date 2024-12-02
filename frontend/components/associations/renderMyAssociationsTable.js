import { getUserId, getUserRole } from '../../utils/utils.js';
import { leaveAssociation, deleteAssociation } from '../associations/associations.js';
import { renderMessages } from '../messages/renderMessage.js'; 

export function renderMyAssociationsTable(associations) {
    const userId = getUserId();
    const userRole = getUserRole();
    const tableBody = document.getElementById("my-associations-body");
    tableBody.innerHTML = ""; // Limpia la tabla

    associations.forEach((assoc) => {
        const row = document.createElement("tr");

        const logoCell = document.createElement("td");
        logoCell.textContent = "📷";
        row.appendChild(logoCell);

        const nameCell = document.createElement("td");
        nameCell.textContent = assoc.name || "Sin nombre";
        nameCell.style.cursor = "pointer"; // Indicar que es clickeable
        nameCell.onclick = () => {
            // Cambiar a la vista de detalles
            document.getElementById('association-name').textContent = assoc.name || "Sin nombre";
            document.getElementById('association-description').textContent = assoc.description || "Sin descripción";
            switchView('association-details-view'); // Cambia la vista
            renderMessages(assoc._id); // Renderiza los mensajes de la asociación
        };
        row.appendChild(nameCell);

        const descCell = document.createElement("td");
        descCell.textContent = assoc.description || "Sin descripción";
        row.appendChild(descCell);

        const actionCell = document.createElement("td");

        const leaveButton = document.createElement("button");
        leaveButton.textContent = "Abandonar";
        leaveButton.onclick = () => leaveAssociation(assoc._id);
        actionCell.appendChild(leaveButton);

        if (assoc.createdBy === userId || userRole === "admin") {
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.onclick = () => deleteAssociation(assoc._id);
            actionCell.appendChild(deleteButton);
        }

        row.appendChild(actionCell);
        tableBody.appendChild(row);
    });
}
