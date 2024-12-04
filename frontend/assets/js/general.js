import { ASSOCIATION_URLS } from "../../constants/urls.js";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages.js";

// Cargar asociaciones al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch(ASSOCIATION_URLS.LIST, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            alert(ERROR_MESSAGES.FETCH_ERROR);
            return;
        }

        const associations = await response.json();
        const tableBody = document.getElementById("associationsTableBody");
        tableBody.innerHTML = "";
        associations.forEach((assoc) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${assoc.name}</td>
                <td>${assoc.description}</td>
                <td>
                    <button class="btn btn-primary btn-sm" data-id="${assoc.id}" data-action="view">👁️ Ver</button>
                    <button class="btn btn-success btn-sm" data-id="${assoc.id}" data-action="join">✔️ Unirse</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Agregar eventos a los botones
        tableBody.addEventListener("click", handleTableActions);
    } catch (error) {
        console.error(error);
        alert(ERROR_MESSAGES.FETCH_ERROR);
    }
});

// Manejo de acciones en la tabla
async function handleTableActions(event) {
    const button = event.target.closest("button");
    if (!button) return;

    const associationId = button.getAttribute("data-id");
    const action = button.getAttribute("data-action");

    try {
        if (action === "join") {
            const response = await fetch(`${ASSOCIATION_URLS.CREATE}/${associationId}/join`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                alert(SUCCESS_MESSAGES.ASSOCIATION_JOINED);
                location.reload();
            } else {
                alert(ERROR_MESSAGES.FETCH_ERROR);
            }
        } else if (action === "view") {
            window.location.href = `./detalle.html?id=${associationId}`;
        }
    } catch (error) {
        console.error(error);
        alert(ERROR_MESSAGES.FETCH_ERROR);
    }
}
