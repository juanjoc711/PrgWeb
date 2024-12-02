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
} from '../controllers/associationController.js';
import authenticateToken from '../middleware/auth.js';
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

router.use(authenticateToken);

// Rutas CRUD
router.post('/', createAssociation);
router.get('/', listAssociations);
router.put('/:id', updateAssociation);
router.delete('/:id', deleteAssociation);

// Otras rutas
router.post('/:id/join', joinAssociation);
router.post('/:id/leave', leaveAssociation);
router.get('/my', myAssociations);

//Buscar asociacion por nombre
router.get('/search', searchAssociations);

//Borrar asociaciones para los admin
router.delete('/:id', authenticateToken, checkRole('admin'), deleteAssociation);

export default router;
