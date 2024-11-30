const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Importa cors

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Permitir CORS
app.use(cors()); // Aplica el middleware cors

app.use(express.json());

// Rutas principales
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

// Conexión a MongoDB
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conexión a MongoDB exitosa'))
    .catch(err => console.error('Error al conectar a MongoDB', err));

// Middleware de autenticación
const authenticateToken = require('./src/middleware/auth');

// Rutas de autenticación
const authRoutes = require('./src/routes/auth');
app.use('/auth', authRoutes);

// Rutas de asociaciones
const associationsRoutes = require('./src/routes/associations');
app.use('/associations', associationsRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
