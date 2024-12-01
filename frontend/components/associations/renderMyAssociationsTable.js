
import { getUserId, getUserRole } from '../../utils/utils.js'; // Verifica que la ruta sea correcta
import { leaveAssociation, deleteAssociation } from '../associations/associations.js';

export function renderMyAssociationsTable(associations) {
  const userId = getUserId();
  const userRole = getUserRole();
  const tableBody = document.getElementById("my-associations-body");
  tableBody.innerHTML = ""; // Limpia la tabla

  associations.forEach((assoc) => {
    console.log("Procesando asociación:", assoc);

    const row = document.createElement("tr");

    const logoCell = document.createElement("td");
    logoCell.textContent = "📷";
    row.appendChild(logoCell);

    const nameCell = document.createElement("td");
    nameCell.textContent = assoc.name || "Sin nombre";
    row.appendChild(nameCell);

    const descCell = document.createElement("td");
    descCell.textContent = assoc.description || "Sin descripción";
    row.appendChild(descCell);

    const actionCell = document.createElement("td");

    const leaveButton = document.createElement("button");
    leaveButton.textContent = "Abandonar";
    leaveButton.onclick = () => leaveAssociation(assoc._id);
    actionCell.appendChild(leaveButton);

    // Mostrar botón de eliminar si es creador o admin
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
