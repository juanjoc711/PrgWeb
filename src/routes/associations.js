const express = require('express');
const Association = require('../models/Association');
const authenticateToken = require('../middleware/auth'); // Middleware para autenticación
const checkRole = require('../middleware/checkRole'); // Middleware para verificar roles

const router = express.Router();

// Aplica el middleware de autenticación a todas las rutas de este router
router.use(authenticateToken);

// Crear una nueva asociación con validaciones
router.post('/', async (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({ error: 'El nombre y la descripción son obligatorios' });
    }

    try {
        const association = new Association({
            name,
            description,
            createdBy: req.user.id, // Asociar la creación al usuario autenticado
        });
        await association.save();
        res.status(201).json(association);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar todas las asociaciones
router.get('/', async (req, res) => {
    try {
        const associations = await Association.find().populate('createdBy', 'username');
        res.status(200).json(associations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar una asociación (solo creador o admin)
router.put('/:id', async (req, res) => {
    try {
        const association = await Association.findById(req.params.id);

        if (!association) {
            return res.status(404).send('Asociación no encontrada');
        }

        // Verificar permisos
        if (req.user.role !== 'admin' && association.createdBy.toString() !== req.user.id) {
            return res.status(403).send('No tienes permisos para actualizar esta asociación');
        }

        const updated = await Association.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar una asociación (solo creador o admin)
router.delete('/:id', async (req, res) => {
    try {
        const association = await Association.findById(req.params.id);

        if (!association) {
            return res.status(404).send('Asociación no encontrada');
        }

        // Verificar permisos
        if (req.user.role !== 'admin' && association.createdBy.toString() !== req.user.id) {
            return res.status(403).send('No tienes permisos para eliminar esta asociación');
        }

        await association.remove();
        res.status(200).send('Asociación eliminada correctamente');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

module.exports = router;


// Unirse a una asociación
router.post('/:id/join', async (req, res) => {
    try {
        const association = await Association.findById(req.params.id);

        if (!association) {
            return res.status(404).send('Asociación no encontrada');
        }

        // Verificar si el usuario ya es miembro
        if (association.members.includes(req.user.id)) {
            return res.status(400).send('Ya eres miembro de esta asociación');
        }

        // Agregar usuario al array de miembros
        association.members.push(req.user.id);
        await association.save();

        res.status(200).send('Te has unido a la asociación');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener asociaciones del usuario logueado
router.get('/my', async (req, res) => {
    try {
      const associations = await Association.find({ members: req.user.id });
      res.status(200).json(associations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

//Dejaruna asociacion
  router.post('/:id/leave', async (req, res) => {
    try {
      const association = await Association.findById(req.params.id);
  
      if (!association) {
        return res.status(404).send("Asociación no encontrada");
      }
  
      // Verificar si el usuario es miembro
      const index = association.members.indexOf(req.user.id);
      if (index === -1) {
        return res.status(400).send("No eres miembro de esta asociación");
      }
  
      // Eliminar usuario del array de miembros
      association.members.splice(index, 1);
      await association.save();
  
      res.status(200).send("Has abandonado la asociación");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  