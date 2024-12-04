import Message from '../models/Message.js';

// Obtener todos los mensajes de una asociación
export const getMessagesByAssociation = async (req, res) => {
    try {
        const associationId = req.params.id.trim(); // Limpia el ID
        console.log('ID de la asociación:', associationId);

        const messages = await Message.find({ association: associationId })
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


// Crear un mensaje para una asociación
export const createMessage = async (req, res) => {
    try {
        const { content } = req.body;
        const message = new Message({
            content,
            author: req.user.id,
            association: req.params.id,
        });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener un mensaje específico
export const getMessageById = async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId).populate('author', 'username');
        if (!message) return res.status(404).json({ error: 'Mensaje no encontrado' });

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un mensaje
export const updateMessage = async (req, res) => {
    try {
        const { content } = req.body;
        const message = await Message.findById(req.params.messageId);

        if (!message) return res.status(404).json({ error: 'Mensaje no encontrado' });

        if (req.user.id !== message.author.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'No tienes permisos para actualizar este mensaje' });
        }

        message.content = content || message.content;
        await message.save();

        res.status(200).json(message);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un mensaje
export const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId);
        if (!message) return res.status(404).json({ error: 'Mensaje no encontrado' });

        if (req.user.id !== message.author.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'No tienes permisos para borrar este mensaje' });
        }

        await message.deleteOne();
        res.status(200).json({ message: 'Mensaje eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
