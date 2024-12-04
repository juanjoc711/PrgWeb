import express from 'express';
import {
    createAssociation,
    listAssociations,
    updateAssociation,
    deleteAssociation,
    joinAssociation,
    leaveAssociation,
    myAssociations,
    searchAssociations,
    getAssociationById
} from '../controllers/associationController.js';
import authenticateToken from '../middleware/auth.js';
import checkRole from '../middleware/checkRole.js';
import upload from '../middleware/upload.js';


// Importar mensajes después
import messagesRoutes from './messagesRoutes.js';

const router = express.Router();

router.use(authenticateToken);

// Rutas de asociaciones
router.post('/', upload.single('image'), createAssociation);
router.get('/', listAssociations);
router.get('/:id', getAssociationById);
router.put('/:id', updateAssociation);
router.delete('/:id', checkRole('admin'), deleteAssociation);

// Subruta para mensajes
router.use('/:id/messages', messagesRoutes); // Registra aquí la subruta

// Otras rutas
router.post('/:id/join', joinAssociation);
router.post('/:id/leave', leaveAssociation);
router.get('/my', myAssociations);
router.get('/search', searchAssociations);

export default router;
