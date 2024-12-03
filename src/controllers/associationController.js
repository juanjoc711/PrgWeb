import Association from '../models/Association.js';

// Crear una nueva asociación
const createAssociation = async (req, res) => {
    try {
        //console.log("Cuerpo recibido:", req.body);
        //console.log("Archivo recibido:", req.file);
        const { name, description } = req.body;

        // Validar campos obligatorios
        if (!name || !description) {
            return res.status(400).json({ error: "El nombre y la descripción son obligatorios" });
        }

        // Procesar la imagen si existe
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const association = new Association({
            name,
            description,
            image,
            createdBy: req.user.id,
        });

        await association.save();
        res.status(201).json(association);
    } catch (error) {
        console.error("Error en createAssociation:", error);
        res.status(500).json({ error: error.message });
    }
};




// Listar todas las asociaciones
const listAssociations = async (req, res) => {
    try {
        const associations = await Association.find().populate('createdBy', 'username');
        res.status(200).json(associations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar una asociación
const updateAssociation = async (req, res) => {
    try {
        const association = await Association.findById(req.params.id);
        if (!association) {
            return res.status(404).send('Asociación no encontrada');
        }

        if (req.user.role !== 'admin' && association.createdBy.toString() !== req.user.id) {
            return res.status(403).send('No tienes permisos para actualizar esta asociación');
        }

        const updated = await Association.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar una asociación
const deleteAssociation = async (req, res) => {
    try {
        const association = await Association.findById(req.params.id);

        if (!association) {
            return res.status(404).json({ error: 'Asociación no encontrada' });
        }

        // Verificar permisos (admin o creador)
        if (req.user.role !== 'admin' && association.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'No tienes permisos para eliminar esta asociación' });
        }

        // Eliminar la asociación usando deleteOne()
        await association.deleteOne();

        res.status(200).json({ message: 'Asociación eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la asociación' });
    }
};

// Unirse a una asociación
const joinAssociation = async (req, res) => {
    try {
        const association = await Association.findById(req.params.id);

        if (!association) {
            return res.status(404).send('Asociación no encontrada');
        }

        if (association.members.includes(req.user.id)) {
            return res.status(400).send('Ya eres miembro de esta asociación');
        }

        association.members.push(req.user.id);
        await association.save();

        res.status(200).send('Te has unido a la asociación');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Dejar una asociación
const leaveAssociation = async (req, res) => {
    try {
        const association = await Association.findById(req.params.id);

        if (!association) {
            return res.status(404).send('Asociación no encontrada');
        }

        const index = association.members.indexOf(req.user.id);
        if (index === -1) {
            return res.status(400).send('No eres miembro de esta asociación');
        }

        association.members.splice(index, 1);
        await association.save();

        res.status(200).send('Has abandonado la asociación');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener asociaciones del usuario logueado
const myAssociations = async (req, res) => {
    try {
        const associations = await Association.find({ members: req.user.id });
        res.status(200).json(associations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Buscar asociaciones por nombre
const searchAssociations = async (req, res) => {
    const { query } = req.query; // Captura el parámetro de búsqueda
    try {
        const associations = await Association.find({
            name: { $regex: query, $options: 'i' } // Búsqueda insensible a mayúsculas/minúsculas
        });
        res.status(200).json(associations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    createAssociation,
    listAssociations,
    updateAssociation,
    deleteAssociation,
    joinAssociation,
    leaveAssociation,
    myAssociations,
    searchAssociations
};
