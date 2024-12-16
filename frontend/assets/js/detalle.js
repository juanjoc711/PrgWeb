import { ASSOCIATION_URLS } from "../../constants/urls.js";
import { ERROR_MESSAGES } from "../../constants/messages.js";
import { getDecodedToken } from "./utils.js";

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
        const tokenPayload = getDecodedToken();
        if (!tokenPayload) {
            alert("Token inválido o expirado. Por favor, inicie sesión nuevamente.");
            location.href = "./index.html";
        }
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
        // Actualizar el chat automáticamente cada 5 segundos
        setInterval(loadChatMessages, 5000);
    } catch (error) {
        console.error(error);
        alert(ERROR_MESSAGES.FETCH_ERROR);
    }
});

// Cargar mensajes del chat
async function loadChatMessages() {
    try {
        const tokenPayload = getDecodedToken(); // Asegura obtener el token decodificado
        if (!tokenPayload) {
            console.error("Token inválido o no encontrado.");
            return;
        }

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
            messageElement.className = `chat-message mb-2 ${
                msg.author._id === tokenPayload.id ? "text-end" : ""
            }`;
            messageElement.innerHTML = `
                <strong>${msg.author.username}</strong>: ${msg.content}
            `;
            chatBox.appendChild(messageElement);
        });

        // Desplazar al último mensaje
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error("Error al cargar mensajes:", error);
        alert(ERROR_MESSAGES.FETCH_ERROR);
    }
}


document.getElementById("chatForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = document.getElementById("chatMessage").value.trim();

    // Validar mensaje vacío
    if (!message) {
        alert("Por favor, escribe un mensaje antes de enviarlo.");
        return;
    }

    try {
        const response = await fetch(ASSOCIATION_URLS.MESSAGES(associationId), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ content: message }),
        });

        if (response.ok) {
            document.getElementById("chatMessage").value = "";
            loadChatMessages(); // Recargar mensajes después de enviar
        } else {
            alert(ERROR_MESSAGES.FETCH_ERROR);
        }
    } catch (error) {
        console.error(error);
        alert(ERROR_MESSAGES.FETCH_ERROR);
    }
});

//volver a vista general asocis
document.getElementById("backToGeneralBtn").addEventListener("click", () => {
    location.href = "./general.html";
});