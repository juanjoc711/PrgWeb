const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const authenticateToken = require('../middleware/auth'); 
const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            password: hashedPassword,
            role: role || 'user',
        });
        await user.save();

        res.status(201).send('Usuario registrado');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(401).send('Credenciales inválidas');
        }
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Cambiar Nombre de Usuario
router.put('/change-username', authenticateToken, async (req, res) => {
    try {
        const { newUsername } = req.body;

        if (!newUsername) {
            return res.status(400).send('El nuevo nombre de usuario es obligatorio');
        }

        const existingUser = await User.findOne({ username: newUsername });
        if (existingUser) {
            return res.status(400).send('El nombre de usuario ya está en uso');
        }

        const user = await User.findById(req.user.id); // Aquí se necesita el middleware
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        user.username = newUsername;
        await user.save();

        res.status(200).send('Nombre de usuario cambiado exitosamente');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cambiar Contraseña
router.put('/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).send('Ambas contraseñas son obligatorias');
        }

        const user = await User.findById(req.user.id); // Aquí también
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).send('La contraseña actual es incorrecta');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).send('Contraseña cambiada exitosamente');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
