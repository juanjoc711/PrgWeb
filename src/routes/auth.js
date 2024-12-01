const express = require('express');
const {
  register,
  login,
  changeUsername,
  changePassword,
} = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Rutas de autenticación
router.post('/register', register);
router.post('/login', login);

// Rutas de cuenta
router.put('/change-username', authenticateToken, changeUsername);
router.put('/change-password', authenticateToken, changePassword);

module.exports = router;
