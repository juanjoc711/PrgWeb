import { getToken } from '../../utils/utils.js';

// Obtener mensajes de una asociación
export async function fetchMessages(associationId) {
    try {
        const res = await fetch(`http://localhost:3000/associations/${associationId}/messages`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });

        if (res.ok) {
            return await res.json();
        } else {
            console.error("Error al obtener mensajes:", res.status);
            return [];
        }
    } catch (error) {
        console.error("Error al obtener mensajes:", error);
        return [];
    }
}

// Crear un mensaje en una asociación
export async function createMessage(associationId, content) {
    try {
        const res = await fetch(`http://localhost:3000/associations/${associationId}/messages`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        });

        if (res.ok) {
            return await res.json();
        } else {
            console.error("Error al crear mensaje:", res.status);
            return null;
        }
    } catch (error) {
        console.error("Error al crear mensaje:", error);
        return null;
    }
}

// Actualizar un mensaje
export async function updateMessage(associationId, messageId, newContent) {
    try {
        const res = await fetch(`http://localhost:3000/associations/${associationId}/messages/${messageId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: newContent }),
        });

        if (res.ok) {
            return await res.json();
        } else {
            console.error("Error al actualizar mensaje:", res.status);
            return null;
        }
    } catch (error) {
        console.error("Error al actualizar mensaje:", error);
        return null;
    }
}

// Eliminar un mensaje
export async function deleteMessage(associationId, messageId) {
    try {
        const res = await fetch(`http://localhost:3000/associations/${associationId}/messages/${messageId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${getToken()}` },
        });

        if (res.ok) {
            console.log("Mensaje eliminado con éxito");
            return true;
        } else {
            console.error("Error al eliminar mensaje:", res.status);
            return false;
        }
    } catch (error) {
        console.error("Error al eliminar mensaje:", error);
        return false;
    }
}
