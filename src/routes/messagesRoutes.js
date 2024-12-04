import express from 'express';
import {
    getMessagesByAssociation,
    createMessage,
    getMessageById,
    updateMessage,
    deleteMessage,
} from '../controllers/messagesController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

// Obtener todos los mensajes de una asociación
router.get('/', authenticateToken, getMessagesByAssociation);

// Crear un mensaje para una asociación
router.post('/', authenticateToken, createMessage);

// Obtener un mensaje específico
router.get('/:messageId', authenticateToken, getMessageById);

// Actualizar un mensaje
router.put('/:messageId', authenticateToken, updateMessage);

// Eliminar un mensaje
router.delete('/:messageId', authenticateToken, deleteMessage);



export default router;
