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
import upload from '../middleware/upload.js';

const router = express.Router();

router.use(authenticateToken);

// Rutas CRUD
router.post('/', upload.single('image'), createAssociation); // Usar multer para manejar la imagen
router.get('/', listAssociations);
router.put('/:id', updateAssociation);
router.delete('/:id', checkRole('admin'), deleteAssociation);

// Otras rutas
router.post('/:id/join', joinAssociation);
router.post('/:id/leave', leaveAssociation);
router.get('/my', myAssociations);
router.get('/search', searchAssociations);

export default router;
