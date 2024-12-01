require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDatabase = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a la base de datos
connectDatabase(); // Asegúrate de conectar la base de datos antes de registrar las rutas

// Configuración de CORS
app.use(cors()); // Permitir cualquier origen para pruebas
app.use(express.json()); // Middleware para analizar JSON

// Rutas
const authRoutes = require('./routes/auth');
const associationsRoutes = require('./routes/associations');

app.use('/auth', authRoutes);
app.use('/associations', associationsRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});