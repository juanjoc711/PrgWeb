import { ASSOCIATION_URLS, AUTH_URLS } from "../../constants/urls.js";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages.js";
import { getDecodedToken, logout } from "./utils.js"; // Import utility function

let currentEditAssociationId = null; // Track the association being edited

// Load associations when the page loads
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const tokenPayload = getDecodedToken();
        if (!tokenPayload) {
            alert("Token inválido o expirado. Por favor, inicie sesión nuevamente.");
            location.href = "./index.html";
        }

        const userId = tokenPayload.id;
        const userRole = tokenPayload.role;

        // Fetch all associations
        const response = await fetch(ASSOCIATION_URLS.LIST, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            console.error("Error al obtener asociaciones:", response.status, await response.text());
            alert(ERROR_MESSAGES.FETCH_ERROR);
            return;
        }

        const associations = await response.json();

        // Fetch user-specific associations
        const userAssociationsResponse = await fetch(`${ASSOCIATION_URLS.USER_ASSOCIATIONS}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!userAssociationsResponse.ok) {
            console.error(
                "Error al obtener asociaciones del usuario:",
                userAssociationsResponse.status,
                await userAssociationsResponse.text()
            );
            alert(ERROR_MESSAGES.FETCH_ERROR);
            return;
        }

        const userAssociations = await userAssociationsResponse.json();
        const userAssociationIds = new Set(userAssociations.map((assoc) => assoc._id));

        // Populate the table
        const tableBody = document.getElementById("associationsTableBody");
        tableBody.innerHTML = "";

        associations.forEach((assoc) => {
            const isMember = userAssociationIds.has(assoc.id);
            const isCreator = assoc.createdBy._id === userId;
            const isAdmin = userRole === "admin";
            const row = document.createElement("tr");
            row.innerHTML = `
                ${assoc.image ? `<td><img src="${assoc.image}" alt="${assoc.name}" class="img-thumbnail" style="max-width: 100px;"></td>` : '<td></td>'}
                <td>${assoc.name}</td>
                <td>${assoc.description}</td>
                <td>
                    <button class="btn btn-info btn-sm" data-id="${assoc.id}" data-action="view">👁️ Ver</button>
                    <button class="btn ${isMember ? "btn-danger" : "btn-success"} btn-sm" 
                            data-id="${assoc.id}" 
                            data-action="${isMember ? "leave" : "join"}">
                        ${isMember ? "❌ Abandonar" : "✔️ Unirse"}
                    </button>
                    ${isCreator || isAdmin ? `<button class="btn btn-warning btn-sm" data-id="${assoc.id}" data-action="edit">✏️ Editar</button>` : ""}
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Attach events to table buttons
        tableBody.addEventListener("click", handleTableActions);
    } catch (error) {
        console.error("Error inesperado durante la inicialización:", error);
        alert(ERROR_MESSAGES.FETCH_ERROR);
    }
});

// Handle actions on the table
async function handleTableActions(event) {
    const button = event.target.closest("button");
    if (!button) return;

    const associationId = button.getAttribute("data-id");
    const action = button.getAttribute("data-action");
    const tokenPayload = getDecodedToken();

    if (!tokenPayload) {
        alert("Token inválido o expirado. Por favor, inicie sesión nuevamente.");
        return;
    }

    const userId = tokenPayload.id;

    try {
        if (action === "join") {
            const response = await fetch(`${ASSOCIATION_URLS.CREATE}/${associationId}/join`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                alert(SUCCESS_MESSAGES.ASSOCIATION_JOINED);
                location.reload();
            } else {
                console.error("Error al unirse a la asociación:", response.status, await response.text());
                alert(ERROR_MESSAGES.FETCH_ERROR);
            }
        } else if (action === "leave") {
            const response = await fetch(`${ASSOCIATION_URLS.CREATE}/${associationId}/leave`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                alert(SUCCESS_MESSAGES.ASSOCIATION_LEFT);
                location.reload();
            } else {
                console.error("Error al abandonar la asociación:", response.status, await response.text());
                alert(ERROR_MESSAGES.FETCH_ERROR);
            }
        } else if (action === "view") {
            window.location.href = `./detalle.html?id=${associationId}`;
        } else if (action === "edit") {
            currentEditAssociationId = associationId;
            openEditModal(associationId);
        }
    } catch (error) {
        console.error("Error inesperado durante la acción de la tabla:", error);
        alert(ERROR_MESSAGES.FETCH_ERROR);
    }
}

// Open the Edit Modal and pre-fill data
async function openEditModal(associationId) {
    try {
        const response = await fetch(`${ASSOCIATION_URLS.UPDATE(associationId)}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            console.error("Error al obtener datos de la asociación:", response.status, await response.text());
            alert(ERROR_MESSAGES.FETCH_ERROR);
            return;
        }

        const association = await response.json();

        document.getElementById("editAssociationName").value = association.name;
        document.getElementById("editAssociationDescription").value = association.description;

        const modal = new bootstrap.Modal(document.getElementById("editAssociationModal"));
        modal.show();
    } catch (error) {
        console.error("Error inesperado durante la obtención de datos de la asociación:", error);
        alert(ERROR_MESSAGES.FETCH_ERROR);
    }
}

// Handle Create Association Form Submission
document.getElementById("createAssociationForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("associationName").value.trim();
    const description = document.getElementById("associationDescription").value.trim();
    const image = document.getElementById("associationImage").files[0];

    if (!name || !description || !image) {
        alert(ERROR_MESSAGES.VALIDATION_ERROR);
        return;
    }

    try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("image", image);

        const response = await fetch(ASSOCIATION_URLS.CREATE, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
        });

        if (response.ok) {
            alert(SUCCESS_MESSAGES.ASSOCIATION_CREATED);
            const modal = bootstrap.Modal.getInstance(document.getElementById("createAssociationModal"));
            modal.hide();
            location.reload();
        } else {
            console.error("Error al crear la asociación:", response.status, await response.text());
            alert(ERROR_MESSAGES.FETCH_ERROR);
        }
    } catch (error) {
        console.error("Error inesperado durante la creación de la asociación:", error);
        alert(ERROR_MESSAGES.FETCH_ERROR);
    }
});

// Handle Edit Association Form Submission
document.getElementById("editAssociationForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("editAssociationName").value.trim();
    const description = document.getElementById("editAssociationDescription").value.trim();
    const image = document.getElementById("editAssociationImage").files[0];

    if (!name || !description) {
        alert(ERROR_MESSAGES.VALIDATION_ERROR);
        return;
    }

    try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        if (image) {
            formData.append("image", image);
        }

        const response = await fetch(`${ASSOCIATION_URLS.UPDATE(currentEditAssociationId)}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
        });

        if (response.ok) {
            alert(SUCCESS_MESSAGES.ASSOCIATION_UPDATED);
            const modal = bootstrap.Modal.getInstance(document.getElementById("editAssociationModal"));
            modal.hide();
            document.getElementById("editAssociationForm").reset();
            location.reload();
        } else {
            console.error("Error al actualizar la asociación:", response.status, await response.text());
            alert(ERROR_MESSAGES.FETCH_ERROR);
        }
    } catch (error) {
        console.error("Error inesperado durante la actualización de la asociación:", error);
        alert(ERROR_MESSAGES.FETCH_ERROR);
    }
});

document.getElementById("logoutLink").addEventListener("click", () => {
    logout();
});

document.getElementById("editAssociationModal").addEventListener("hidden.bs.modal", () => {
    currentEditAssociationId = null;
    document.getElementById("editAssociationForm").reset();
});

document.getElementById("createAssociationModal").addEventListener("hidden.bs.modal", () => {
    document.getElementById("createAssociationForm").reset();
});

async function updateUsername(newUsername) {
    if (!newUsername) {
        alert("El nombre de usuario no puede estar vacío.");
        return;
    }

    try {
        const response = await fetch(`${AUTH_URLS.CHANGE_USERNAME}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ newUsername }),
        });

        if (!response.ok) {
            console.error("Error al actualizar el nombre de usuario:", await response.text());
            alert(ERROR_MESSAGES.PROFILE_UPDATE_FAILED);
            return;
        }

        alert(SUCCESS_MESSAGES.USERNAME_UPDATED);
    } catch (error) {
        console.error("Error inesperado al actualizar el nombre de usuario:", error);
        alert(ERROR_MESSAGES.FETCH_ERROR);
    }
}


async function updatePassword(currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
        alert("Debe ingresar la contraseña actual y la nueva contraseña.");
        return;
    }

    try {
        const response = await fetch(`${AUTH_URLS.CHANGE_PASSWORD}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        if (!response.ok) {
            console.error("Error al actualizar la contraseña:", await response.text());
            alert(ERROR_MESSAGES.PROFILE_UPDATE_FAILED);
            return;
        }

        alert(SUCCESS_MESSAGES.PASSWORD_UPDATED);
    } catch (error) {
        console.error("Error inesperado al actualizar la contraseña:", error);
        alert(ERROR_MESSAGES.FETCH_ERROR);
    }
}

async function updateProfile(newUsername, currentPassword, newPassword) {
    if (!newUsername && !newPassword) {
        alert("Debe ingresar un nuevo nombre de usuario o una nueva contraseña.");
        return;
    }

    try {
        if (newUsername) {
            await updateUsername(newUsername);
        }

        // Update password if provided
        if (currentPassword && newPassword) {
            await updatePassword(currentPassword, newPassword);
        }

        alert(SUCCESS_MESSAGES.PROFILE_UPDATED);
        const modal = bootstrap.Modal.getInstance(document.getElementById("editProfileModal"));
        modal.hide();
    } catch (error) {
        console.error("Error inesperado al actualizar el perfil:", error);
        alert(ERROR_MESSAGES.FETCH_ERROR);
    }
}

document.getElementById("updateProfileButton").addEventListener("click", () => {
    const newUsername = document.getElementById("newUsername").value.trim();
    const currentPassword = document.getElementById("currentPassword").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();

    updateProfile(newUsername, currentPassword, newPassword);
});


document.getElementById("editProfileModal").addEventListener("hidden.bs.modal", () => {
    document.getElementById("editProfileForm").reset();
}
);

