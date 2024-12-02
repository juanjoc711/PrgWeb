import jwt from 'jsonwebtoken';
import constants from '../config/constants.js';

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).send('Acceso denegado');

  try {
    const decoded = jwt.verify(token, constants.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Token inválido');
  }
};

export default authenticateToken;
