const express = require('express');
const Association = require('../models/Association');
const authenticateToken = require('../middleware/auth'); // Middleware para autenticación

const router = express.Router();

// Aplica el middleware a todas las rutas de este router
router.use(authenticateToken);

// Crear una nueva asociación
router.post('/', async (req, res) => {
    try {
        const association = new Association(req.body);
        await association.save();
        res.status(201).json(association);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar todas las asociaciones
router.get('/', async (req, res) => {
    try {
        const associations = await Association.find().populate('members', 'username');
        res.status(200).json(associations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar una asociación
router.put('/:id', async (req, res) => {
    try {
        const association = await Association.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(association);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar una asociación
router.delete('/:id', async (req, res) => {
    try {
        await Association.findByIdAndDelete(req.params.id);
        res.status(200).send('Asociación eliminada correctamente');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
