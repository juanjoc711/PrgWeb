const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { errors, success } = require('../constants/messages');
const { jwtSecret } = require('../config/config');

// Registrar usuario
const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).send(errors.USERNAME_TAKEN);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role: role || 'user' });
    await user.save();

    res.status(201).send(success.USER_CREATED);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Iniciar sesión
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).send(errors.USER_NOT_FOUND);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send(errors.INVALID_PASSWORD);

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Cambiar nombre de usuario
const changeUsername = async (req, res) => {
  try {
    const { newUsername } = req.body;

    if (!newUsername) {
      return res.status(400).send(errors.USERNAME_REQUIRED);
    }

    const existingUser = await User.findOne({ username: newUsername });
    if (existingUser) {
      return res.status(400).send(errors.USERNAME_TAKEN);
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send(errors.USER_NOT_FOUND);
    }

    user.username = newUsername;
    await user.save();

    res.status(200).send(success.USERNAME_UPDATED);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Cambiar contraseña
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).send(errors.PASSWORD_REQUIRED);
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send(errors.USER_NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).send(errors.INVALID_PASSWORD);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).send(success.PASSWORD_UPDATED);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  register,
  login,
  changeUsername,
  changePassword,
};
