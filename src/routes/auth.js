import express from 'express';
import { register, login, changeUsername, changePassword } from '../controllers/authController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// Rutas de autenticación
router.post('/register', register);
router.post('/login', login);

// Rutas de cuenta
router.put('/change-username', authenticateToken, changeUsername);
router.put('/change-password', authenticateToken, changePassword);

export default router;
