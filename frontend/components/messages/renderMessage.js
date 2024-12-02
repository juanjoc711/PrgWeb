import { fetchMessages, createMessage, updateMessage, deleteMessage } from './messages.js';
import { getUserId, getUserRole } from '../../utils/utils.js';

export async function renderMessages(associationId) {
    const messageContainer = document.getElementById('messages-container');
    messageContainer.innerHTML = ''; // Limpia los mensajes

    const messages = await fetchMessages(associationId);

    messages.forEach((message) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');

        const authorSpan = document.createElement('span');
        authorSpan.textContent = message.author.username + ": ";
        messageDiv.appendChild(authorSpan);

        const contentSpan = document.createElement('span');
        contentSpan.textContent = message.content;
        messageDiv.appendChild(contentSpan);

        // Botón para editar mensaje
        if (message.author._id === getUserId()) {
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.onclick = async () => {
                const newContent = prompt('Edita tu mensaje:', message.content);
                if (newContent && newContent !== message.content) {
                    const updatedMessage = await updateMessage(associationId, message._id, newContent);
                    if (updatedMessage) renderMessages(associationId); // Refrescar mensajes
                }
            };
            messageDiv.appendChild(editButton);
        }

        // Botón para eliminar mensaje
        if (message.author._id === getUserId() || getUserRole() === 'admin') {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.onclick = async () => {
                const success = await deleteMessage(associationId, message._id);
                if (success) renderMessages(associationId); // Recargar mensajes
            };
            messageDiv.appendChild(deleteButton);
        }

        messageContainer.appendChild(messageDiv);
    });

    // Agregar campo para enviar mensajes
    const messageForm = document.createElement('form');
    messageForm.onsubmit = async (e) => {
        e.preventDefault();
        const content = e.target.messageInput.value.trim();
        if (content) {
            const newMessage = await createMessage(associationId, content);
            if (newMessage) {
                renderMessages(associationId); // Recargar mensajes
                e.target.messageInput.value = ''; // Limpiar campo
            }
        }
    };

    const messageInput = document.createElement('input');
    messageInput.type = 'text';
    messageInput.name = 'messageInput';
    messageInput.placeholder = 'Escribe un mensaje...';

    const sendButton = document.createElement('button');
    sendButton.textContent = 'Enviar';

    messageForm.appendChild(messageInput);
    messageForm.appendChild(sendButton);
    messageContainer.appendChild(messageForm);
}
