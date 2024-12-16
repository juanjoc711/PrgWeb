import { ASSOCIATION_URLS } from "../../constants/urls.js";
import { ERROR_MESSAGES } from "../../constants/messages.js";
import { getDecodedToken } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Validar token y redirigir si es inválido
        const tokenPayload = getDecodedToken();
        if (!tokenPayload) {
            alert("Token inválido o expirado. Por favor, inicie sesión nuevamente.");
            location.href = "./index.html";
            return;
        }

        // Solicitar las asociaciones del usuario
        const response = await fetch(ASSOCIATION_URLS.USER_ASSOCIATIONS, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            console.error("Error al obtener tus asociaciones:", response.status, await response.text());
            alert(ERROR_MESSAGES.FETCH_ERROR);
            return;
        }

        const userAssociations = await response.json();
        const tableBody = document.getElementById("userAssociationsTableBody");

        // Si no hay asociaciones, mostrar mensaje
        if (userAssociations.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted">
                        No estás unido a ninguna asociación.
                    </td>
                </tr>
            `;
            return;
        }

        // Renderizar las asociaciones en la tabla
        tableBody.innerHTML = ""; // Limpiar contenido previo
        userAssociations.forEach((assoc) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                ${assoc.image ? `<td><img src="${assoc.image}" alt="${assoc.name}" class="img-thumbnail" style="max-width: 100px;"></td>` : '<td></td>'}
                <td>${assoc.name}</td>
                <td>${assoc.description}</td>
                <td>
                    <button class="btn btn-info btn-sm" data-id="${assoc.id}" data-action="view">👁️ Ver</button>
                    <button class="btn btn-danger btn-sm" data-id="${assoc.id}" data-action="leave">❌ Abandonar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Manejar eventos en los botones de la tabla
        tableBody.addEventListener("click", handleTableActions);
    } catch (error) {
        console.error("Error inesperado:", error);
        alert(ERROR_MESSAGES.FETCH_ERROR);
    }
});

// Manejar acciones en los botones
async function handleTableActions(event) {
    const button = event.target.closest("button");
    if (!button) return;

    const associationId = button.getAttribute("data-id");
    const action = button.getAttribute("data-action");

    try {
        if (action === "leave") {
            const response = await fetch(`${ASSOCIATION_URLS.CREATE}/${associationId}/leave`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                alert("Has abandonado la asociación.");
                location.reload();
            } else {
                console.error("Error al abandonar la asociación:", response.status, await response.text());
                alert(ERROR_MESSAGES.FETCH_ERROR);
            }
        } else if (action === "view") {
            window.location.href = `./detalle.html?id=${associationId}`;
        }
    } catch (error) {
        console.error("Error inesperado durante la acción:", error);
        alert(ERROR_MESSAGES.FETCH_ERROR);
    }
}

document.getElementById("backToGeneralBtn").addEventListener("click", () => {
    location.href = "./general.html";
});