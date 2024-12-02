import express from 'express';
import {
    getMessagesByAssociation,
    createMessage,
    getMessageById,
    updateMessage,
    deleteMessage
} from '../controllers/messagesController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los mensajes de una asociación
router.get('/:id/messages', authenticateToken, getMessagesByAssociation);

// Crear un mensaje para una asociación
router.post('/:id/messages', authenticateToken, createMessage);

// Obtener un mensaje específico
router.get('/:id/messages/:messageId', authenticateToken, getMessageById);

// Actualizar un mensaje
router.put('/:id/messages/:messageId', authenticateToken, updateMessage);

// Eliminar un mensaje
router.delete('/:id/messages/:messageId', authenticateToken, deleteMessage);

export default router;
