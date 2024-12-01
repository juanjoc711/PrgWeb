const express = require('express');
const { 
    createAssociation, 
    listAssociations, 
    updateAssociation, 
    deleteAssociation, 
    joinAssociation, 
    leaveAssociation, 
    myAssociations 
} = require('../controllers/associationController');
const authenticateToken = require('../middleware/auth');

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

module.exports = router;
