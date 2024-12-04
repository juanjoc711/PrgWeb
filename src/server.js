import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDatabase from './config/database.js';
import authRoutes from './routes/auth.js';
import associationsRoutes from './routes/associations.js';
import messagesRoutes from './routes/messagesRoutes.js';

// Configuración de __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a la base de datos
connectDatabase(); // Conectar la base de datos

// Configuración de CORS y análisis de JSON y urlencoded Para procesar datos de formularios
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Manejo de archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/auth', authRoutes);
app.use('/associations', associationsRoutes);
app.use('/messages', messagesRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});