import express from 'express';
import cors from 'cors';
import connectDatabase from './config/database.js';
import authRoutes from './routes/auth.js';
import associationsRoutes from './routes/associations.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a la base de datos
connectDatabase(); // Asegúrate de conectar la base de datos antes de registrar las rutas

// Configuración de CORS
app.use(cors()); // Permitir cualquier origen para pruebas
app.use(express.json()); // Middleware para analizar JSON

// Rutas
app.use('/auth', authRoutes);
app.use('/associations', associationsRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
