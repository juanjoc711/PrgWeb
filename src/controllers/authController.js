import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import messages from '../constants/messages.js';
import constants from '../config/constants.js';

// Registrar usuario
const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).send(messages.errors.USERNAME_TAKEN);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role: role || 'user' });
    await user.save();

    res.status(201).send(messages.success.USER_CREATED);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Iniciar sesión
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).send(messages.errors.USER_NOT_FOUND);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send(messages.errors.INVALID_PASSWORD);

    const token = jwt.sign({ id: user._id, role: user.role }, constants.jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

// Cambiar nombre de usuario
const changeUsername = async (req, res) => {
  try {
    const { newUsername } = req.body;

    if (!newUsername) {
      return res.status(400).send(messages.errors.USERNAME_REQUIRED);
    }

    const existingUser = await User.findOne({ username: newUsername });
    if (existingUser) {
      return res.status(400).send(messages.errors.USERNAME_TAKEN);
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send(messages.errors.USER_NOT_FOUND);
    }

    user.username = newUsername;
    await user.save();

    res.status(200).send(messages.success.USERNAME_UPDATED);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Cambiar contraseña
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).send(messages.errors.PASSWORD_REQUIRED);
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send(messages.errors.USER_NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).send(messages.errors.INVALID_PASSWORD);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).send(messages.success.PASSWORD_UPDATED);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Actualizar perfil: nombre de usuario o contraseña
const updateProfile = async (req, res) => {
  try {
      const { newUsername, currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user.id);
      if (!user) {
          return res.status(404).send(messages.errors.USER_NOT_FOUND);
      }

      // Validar y actualizar el nombre de usuario
      if (newUsername) {
          const existingUser = await User.findOne({ username: newUsername });
          if (existingUser) {
              return res.status(400).send(messages.errors.USERNAME_TAKEN);
          }
          user.username = newUsername;
      }

      // Validar y actualizar la contraseña
      if (currentPassword && newPassword) {
          const isMatch = await bcrypt.compare(currentPassword, user.password);
          if (!isMatch) {
              return res.status(400).send(messages.errors.INVALID_PASSWORD);
          }
          user.password = await bcrypt.hash(newPassword, 10);
      }

      await user.save();
      res.status(200).send("Perfil actualizado correctamente.");
  } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      res.status(500).send("Error interno del servidor.");
  }
};

export {
  register,
  login,
  changeUsername,
  changePassword,
  updateProfile,
};
