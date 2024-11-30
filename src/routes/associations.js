const express = require('express');
const Association = require('../models/Association');
const authenticateToken = require('../middleware/auth'); // Middleware para autenticación

const router = express.Router();

// Aplica el middleware a todas las rutas de este router
router.use(authenticateToken);

// Crear una nueva asociación con validaciones
router.post('/', async (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({ error: 'El nombre y la descripción son obligatorios' });
    }

    try {
        const association = new Association({ name, description });
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
// Buscar asociaciones por nombre o descripción
router.get('/search', async (req, res) => {
    const { query } = req.query; // Parámetro de búsqueda
    try {
        const associations = await Association.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });
        res.status(200).json(associations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
