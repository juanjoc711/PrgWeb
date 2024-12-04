import { ASSOCIATION_URLS } from "../../constants/urls.js";
import { ERROR_MESSAGES } from "../../constants/messages.js";

// Obtener parámetros de URL
const urlParams = new URLSearchParams(window.location.search);
const associationId = urlParams.get("id");

if (!associationId) {
    alert("ID de la asociación no encontrado en la URL.");
    window.location.href = "index.html";
}



// Cargar detalles de la asociación
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch(`${ASSOCIATION_URLS.LIST}/${associationId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            alert(ERROR_MESSAGES.FETCH_ERROR);
            return;
        }

        const association = await response.json();
        document.getElementById("associationName").textContent = association.name;
        document.getElementById("associationImage").src = association.image || "./assets/img/default.png";
        document.getElementById("associationDescription").textContent = association.description;

        // Cargar mensajes del chat
        loadChatMessages();
    } catch (error) {
        console.error(error);
        alert(ERROR_MESSAGES.FETCH_ERROR);
    }
});

// Cargar mensajes del chat
async function loadChatMessages() {
    try {
        const response = await fetch(ASSOCIATION_URLS.MESSAGES(associationId), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            alert(ERROR_MESSAGES.FETCH_ERROR);
            return;
        }

        const messages = await response.json();
        const chatBox = document.getElementById("chatBox");
        chatBox.innerHTML = "";

        messages.forEach((msg) => {
            const messageElement = document.createElement("div");
            messageElement.className = "chat-message mb-2";
            messageElement.innerHTML = `
                <strong>${msg.author.username}</strong>: ${msg.content}
            `;
            chatBox.appendChild(messageElement);
        });
    } catch (error) {
        console.error(error);
        alert(ERROR_MESSAGES.FETCH_ERROR);
    }
}

document.getElementById("chatForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = document.getElementById("chatMessage").value;

    if (!message.trim()) return;

    try {
        const response = await fetch(`${ASSOCIATION_URLS.LIST}/${associationId}/messages`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        

        if (response.ok) {
            document.getElementById("chatMessage").value = "";
            loadChatMessages(); // Recargar mensajes
        } else {
            alert(ERROR_MESSAGES.FETCH_ERROR);
        }
    } catch (error) {
        console.error(error);
        alert(ERROR_MESSAGES.FETCH_ERROR);
    }
});

